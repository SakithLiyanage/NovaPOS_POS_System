const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Expense = require('../models/Expense');
const Customer = require('../models/Customer');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);
router.use(requireRole('OWNER', 'MANAGER'));

// Profit & Loss Report
router.get('/profit-loss', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate + 'T23:59:59');

    const salesData = await Sale.aggregate([
      { $match: { createdAt: dateFilter, status: 'COMPLETED' } },
      { $unwind: '$items' },
      {
        $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productInfo' }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$items.lineTotal' },
          cost: { $sum: { $multiply: ['$items.quantity', { $arrayElemAt: ['$productInfo.costPrice', 0] }] } },
        }
      },
    ]);

    const expenses = await Expense.aggregate([
      { $match: { date: dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const revenue = salesData[0]?.revenue || 0;
    const cogs = salesData[0]?.cost || 0;
    const grossProfit = revenue - cogs;
    const operatingExpenses = expenses[0]?.total || 0;
    const netProfit = grossProfit - operatingExpenses;

    res.json({
      success: true,
      data: { revenue, cogs, grossProfit, operatingExpenses, netProfit, grossMargin: revenue > 0 ? (grossProfit / revenue * 100).toFixed(2) : 0 },
    });
  } catch (error) {
    next(error);
  }
});

// Inventory Valuation
router.get('/inventory-valuation', async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });
    
    const valuation = products.map(p => ({
      name: p.name,
      sku: p.sku,
      stock: p.currentStock,
      costValue: p.currentStock * p.costPrice,
      retailValue: p.currentStock * p.salePrice,
    }));

    const totals = valuation.reduce((acc, p) => ({
      totalStock: acc.totalStock + p.stock,
      totalCost: acc.totalCost + p.costValue,
      totalRetail: acc.totalRetail + p.retailValue,
    }), { totalStock: 0, totalCost: 0, totalRetail: 0 });

    res.json({ success: true, data: { items: valuation, totals } });
  } catch (error) {
    next(error);
  }
});

// Customer Insights
router.get('/customer-insights', async (req, res, next) => {
  try {
    const topCustomers = await Sale.aggregate([
      { $match: { status: 'COMPLETED', customer: { $ne: null } } },
      { $group: { _id: '$customer', totalSpent: { $sum: '$grandTotal' }, orderCount: { $sum: 1 }, avgOrder: { $avg: '$grandTotal' } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'customers', localField: '_id', foreignField: '_id', as: 'customer' } },
      { $unwind: '$customer' },
      { $project: { name: '$customer.name', email: '$customer.email', totalSpent: 1, orderCount: 1, avgOrder: 1 } },
    ]);

    const customerStats = await Customer.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 12 },
    ]);

    res.json({ success: true, data: { topCustomers, growthTrend: customerStats } });
  } catch (error) {
    next(error);
  }
});

// Hourly Sales Analysis
router.get('/hourly-analysis', async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const hourlyData = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay }, status: 'COMPLETED' } },
      { $group: { _id: { $hour: '$createdAt' }, sales: { $sum: 1 }, revenue: { $sum: '$grandTotal' } } },
      { $sort: { _id: 1 } },
    ]);

    const hours = Array.from({ length: 24 }, (_, i) => {
      const found = hourlyData.find(h => h._id === i);
      return { hour: i, sales: found?.sales || 0, revenue: found?.revenue || 0 };
    });

    res.json({ success: true, data: hours });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
