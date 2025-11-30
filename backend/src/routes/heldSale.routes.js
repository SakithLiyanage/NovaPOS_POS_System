const express = require('express');
const router = express.Router();
const HeldSale = require('../models/HeldSale');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const heldSales = await HeldSale.find()
      .populate('heldBy', 'name')
      .populate('customer', 'name phone')
      .sort('-createdAt');
    res.json({ success: true, data: heldSales });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const heldSale = await HeldSale.create({ ...req.body, heldBy: req.user._id });
    res.status(201).json({ success: true, data: heldSale });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await HeldSale.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Held sale removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
