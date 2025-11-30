const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      category,
      brand,
      isActive,
      lowStock,
    } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') },
        { barcode: new RegExp(search, 'i') },
      ];
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$currentStock', '$lowStockThreshold'] };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort('name')
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

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const existingProduct = await Product.findOne({
      sku: req.body.sku.toUpperCase(),
    });
    if (existingProduct) {
      throw new ApiError(400, 'Product with this SKU already exists');
    }

    const product = await Product.create({
      ...req.body,
      sku: req.body.sku.toUpperCase(),
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, sku: req.body.sku?.toUpperCase() },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.json({ success: true, message: 'Product deactivated' });
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
