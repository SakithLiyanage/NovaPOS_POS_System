const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getProductRecommendations,
  analyzeSalesTrend,
  generateProductDescription,
  chatWithAssistant,
  predictLowStock,
} = require('../services/aiService');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Settings = require('../models/Settings');

router.use(auth);

// AI Chat Assistant
router.post('/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    
    // Get context
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [settings, todaySales, activeProducts] = await Promise.all([
      Settings.findOne(),
      Sale.countDocuments({ createdAt: { $gte: today }, status: 'COMPLETED' }),
      Product.countDocuments({ isActive: true }),
    ]);

    const response = await chatWithAssistant(message, {
      storeName: settings?.storeName,
      todaySales,
      activeProducts,
    });

    res.json({ success: true, data: { message: response } });
  } catch (error) {
    next(error);
  }
});

// Product Recommendations
router.post('/recommendations', async (req, res, next) => {
  try {
    const { cartItems } = req.body;
    const products = await Product.find({ isActive: true }).populate('category', 'name').limit(50);
    
    const recommendations = await getProductRecommendations(cartItems || [], products);
    
    // Find actual products matching recommendations
    const recommendedProducts = await Product.find({
      name: { $in: recommendations },
      isActive: true,
    }).limit(3);

    res.json({ success: true, data: recommendedProducts });
  } catch (error) {
    next(error);
  }
});

// Sales Analysis
router.get('/sales-analysis', async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const salesData = await Sale.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const analysis = await analyzeSalesTrend(salesData);
    res.json({ success: true, data: { analysis, salesData } });
  } catch (error) {
    next(error);
  }
});

// Generate Product Description
router.post('/generate-description', async (req, res, next) => {
  try {
    const { productName, category } = req.body;
    const description = await generateProductDescription(productName, category);
    res.json({ success: true, data: { description } });
  } catch (error) {
    next(error);
  }
});

// Predict Low Stock
router.get('/predict-stock', async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort('currentStock').limit(30);
    const predictions = await predictLowStock(products);
    
    const predictedProducts = await Product.find({
      name: { $in: predictions },
      isActive: true,
    });

    res.json({ success: true, data: predictedProducts });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
