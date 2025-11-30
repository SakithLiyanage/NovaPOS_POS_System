const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/stats', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Today's stats
    const todayStats = await Sale.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'COMPLETED' } },
      { $group: { _id: null, revenue: { $sum: '$grandTotal' }, count: { $sum: 1 } } },
    ]);

    // Sales trend (last 7 days)
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

    // Product counts
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Low stock count
    const lowStockCount = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
    });

    const todayData = todayStats[0] || { revenue: 0, count: 0 };

    res.json({
      success: true,
      data: {
        today: {
          revenue: todayData.revenue || 0,
          sales: todayData.count || 0,
          avgOrder: todayData.count > 0 ? todayData.revenue / todayData.count : 0,
        },
        products: {
          active: activeProducts,
          lowStock: lowStockCount,
        },
        salesTrend,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
