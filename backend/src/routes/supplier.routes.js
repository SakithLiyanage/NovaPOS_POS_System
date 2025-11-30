const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);
router.use(requireRole('OWNER', 'MANAGER'));

router.get('/', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({ isActive: true }).sort('name');
    res.json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Supplier.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Supplier deactivated' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
