const Sale = require('../models/Sale');
const Product = require('../models/Product');
const {
  getSalesReport,
  getProductPerformance,
  getCashierPerformance,
  getPaymentMethodBreakdown,
} = require('../services/reportService');
const { getStockValue } = require('../services/stockService');

const getSummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [todayStats, yesterdayStats, productCount] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: today }, status: 'COMPLETED' } },
        { $group: { _id: null, revenue: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        { $match: { createdAt: { $gte: yesterday, $lt: today }, status: 'COMPLETED' } },
        { $group: { _id: null, revenue: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
      ]),
      Product.countDocuments({ isActive: true }),
    ]);

    const todayData = todayStats[0] || { revenue: 0, count: 0 };
    const yesterdayData = yesterdayStats[0] || { revenue: 0, count: 0 };

    const revenueChange = yesterdayData.revenue > 0
      ? ((todayData.revenue - yesterdayData.revenue) / yesterdayData.revenue * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        todayRevenue: todayData.revenue,
        todaySales: todayData.count,
        avgOrderValue: todayData.count > 0 ? todayData.revenue / todayData.count : 0,
        activeProducts: productCount,
        revenueChange: parseFloat(revenueChange),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSalesByDate = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate + 'T23:59:59') : new Date();

    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          revenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate + 'T23:59:59') : new Date();

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'COMPLETED' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getSalesByCategory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const salesByCategory = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED',
        },
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$categoryInfo._id', 0] },
          name: { $first: { $arrayElemAt: ['$categoryInfo.name', 0] } },
          revenue: { $sum: '$items.lineTotal' },
          count: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      success: true,
      data: salesByCategory.map(s => ({
        categoryId: s._id,
        name: s.name || 'Uncategorized',
        revenue: s.revenue,
        count: s.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getAdvancedReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const end = endDate || new Date().toISOString();

    const [salesReport, topProducts, cashierStats, paymentBreakdown, stockValue] = await Promise.all([
      getSalesReport(start, end),
      getProductPerformance(start, end, 10),
      getCashierPerformance(start, end),
      getPaymentMethodBreakdown(start, end),
      getStockValue(),
    ]);

    res.json({
      success: true,
      data: {
        salesReport,
        topProducts,
        cashierStats,
        paymentBreakdown,
        stockValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSalesHeatmap = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Sale.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'COMPLETED' } },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            hour: { $hour: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$grandTotal' },
        },
      },
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const heatmap = {};

    result.forEach(item => {
      const day = days[item._id.dayOfWeek - 1];
      const key = `${day}-${item._id.hour}`;
      heatmap[key] = { count: item.count, revenue: item.revenue };
    });

    res.json({ success: true, data: heatmap });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getSalesByDate,
  getTopProducts,
  getSalesByCategory,
  getAdvancedReport,
  getSalesHeatmap,
};
