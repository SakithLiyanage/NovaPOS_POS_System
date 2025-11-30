const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, requireRole } = require('../middleware/auth');
const ApiError = require('../utils/apiError');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({ name, slug, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const slug = name?.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, description, isActive },
      { new: true, runValidators: true }
    );
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
