const Product = require('../models/Product');
const StockEntry = require('../models/StockEntry');
const ApiError = require('../utils/apiError');

const adjustStock = async (req, res, next) => {
  try {
    const { productId, quantityChange, reason, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const previousStock = product.currentStock;
    const newStock = previousStock + quantityChange;

    if (newStock < 0) {
      throw new ApiError(400, 'Stock cannot be negative');
    }

    // Update product stock
    product.currentStock = newStock;
    await product.save();

    // Create stock entry
    const stockEntry = await StockEntry.create({
      product: productId,
      quantityChange,
      previousStock,
      newStock,
      reason,
      notes,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      data: {
        product,
        stockEntry,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
    })
      .populate('category', 'name')
      .sort('currentStock');

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getStockHistory = async (req, res, next) => {
  try {
    const { productId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (productId) {
      query.product = productId;
    }

    const total = await StockEntry.countDocuments(query);
    const entries = await StockEntry.find(query)
      .populate('product', 'name sku')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { adjustStock, getLowStock, getStockHistory };
