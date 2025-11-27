const Product = require('../models/Product');
const StockEntry = require('../models/StockEntry');
const ApiError = require('../utils/apiError');

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      isActive,
      page = 1,
      limit = 20,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products,
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

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('brand', 'name');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    
    if (req.body.categoryId) {
      productData.category = req.body.categoryId;
    }
    if (req.body.brandId) {
      productData.brand = req.body.brandId;
    }

    const product = await Product.create(productData);

    // Create initial stock entry if stock > 0
    if (product.currentStock > 0) {
      await StockEntry.create({
        product: product._id,
        quantityChange: product.currentStock,
        previousStock: 0,
        newStock: product.currentStock,
        reason: 'PURCHASE',
        notes: 'Initial stock',
        createdBy: req.user._id,
      });
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.categoryId !== undefined) {
      updateData.category = req.body.categoryId || null;
    }
    if (req.body.brandId !== undefined) {
      updateData.brand = req.body.brandId || null;
    }

    // Don't allow stock updates through this endpoint
    delete updateData.currentStock;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name')
      .populate('brand', 'name');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
