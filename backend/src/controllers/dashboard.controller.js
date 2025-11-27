const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Today's stats
    const todayStats = await Sale.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'COMPLETED' } },
      { $group: { _id: null, revenue: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
    ]);

    // This month's stats
    const monthStats = await Sale.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: 'COMPLETED' } },
      { $group: { _id: null, revenue: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
    ]);

    // Last month's stats for comparison
    const lastMonthStats = await Sale.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lte: lastMonthEnd }, status: 'COMPLETED' } },
      { $group: { _id: null, revenue: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
    ]);

    // Product counts
    const productCounts = await Product.aggregate([
      { $group: { _id: '$isActive', count: { $sum: 1 } } },
    ]);

    // Low stock count
    const lowStockCount = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
    });

    // Customer count
    const customerCount = await Customer.countDocuments();

    // Recent sales trend (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await Sale.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const todayData = todayStats[0] || { revenue: 0, count: 0 };
    const monthData = monthStats[0] || { revenue: 0, count: 0 };
    const lastMonthData = lastMonthStats[0] || { revenue: 0, count: 0 };

    const monthGrowth = lastMonthData.revenue > 0
      ? ((monthData.revenue - lastMonthData.revenue) / lastMonthData.revenue * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        today: {
          revenue: todayData.revenue,
          sales: todayData.count,
          avgOrder: todayData.count > 0 ? todayData.revenue / todayData.count : 0,
        },
        month: {
          revenue: monthData.revenue,
          sales: monthData.count,
          growth: parseFloat(monthGrowth),
        },
        products: {
          active: productCounts.find(p => p._id === true)?.count || 0,
          inactive: productCounts.find(p => p._id === false)?.count || 0,
          lowStock: lowStockCount,
        },
        customers: customerCount,
        salesTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
