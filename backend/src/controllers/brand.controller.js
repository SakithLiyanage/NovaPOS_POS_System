const Brand = require('../models/Brand');
const ApiError = require('../utils/apiError');

const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort('name');
    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }
    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      throw new ApiError(404, 'Brand not found');
    }
    res.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
