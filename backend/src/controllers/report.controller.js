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

    // Today's stats
    const todaySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: 'COMPLETED',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Yesterday's stats for comparison
    const yesterdaySales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: today },
          status: 'COMPLETED',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
    ]);

    const todayData = todaySales[0] || { totalRevenue: 0, count: 0 };
    const yesterdayData = yesterdaySales[0] || { totalRevenue: 0, count: 0 };

    // Calculate percentage changes
    const revenueChange = yesterdayData.totalRevenue > 0
      ? ((todayData.totalRevenue - yesterdayData.totalRevenue) / yesterdayData.totalRevenue * 100).toFixed(1)
      : 0;

    const salesChange = yesterdayData.count > 0
      ? ((todayData.count - yesterdayData.count) / yesterdayData.count * 100).toFixed(1)
      : 0;

    const avgOrderValue = todayData.count > 0 
      ? todayData.totalRevenue / todayData.count 
      : 0;

    const yesterdayAvg = yesterdayData.count > 0 
      ? yesterdayData.totalRevenue / yesterdayData.count 
      : 0;

    const aovChange = yesterdayAvg > 0
      ? ((avgOrderValue - yesterdayAvg) / yesterdayAvg * 100).toFixed(1)
      : 0;

    // Active products count
    const activeProducts = await Product.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        todayRevenue: todayData.totalRevenue,
        todaySales: todayData.count,
        avgOrderValue,
        activeProducts,
        revenueChange: parseFloat(revenueChange),
        salesChange: parseFloat(salesChange),
        aovChange: parseFloat(aovChange),
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
    const end = endDate ? new Date(endDate) : new Date();

    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } };
        break;
      case 'month':
        dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const sales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED',
        },
      },
      {
        $group: {
          _id: dateFormat,
          revenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: sales.map(s => ({
        date: s._id,
        revenue: s.revenue,
        count: s.count,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const topProducts = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'COMPLETED',
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          soldCount: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.lineTotal' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
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
