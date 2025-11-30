const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { auth, requireRole } = require('../middleware/auth');
const ApiError = require('../utils/apiError');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.find().sort('name');
    res.json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!brand) throw new ApiError(404, 'Brand not found');
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) throw new ApiError(404, 'Brand not found');
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
