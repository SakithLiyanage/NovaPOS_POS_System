const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const { auth, requireRole } = require('../middleware/auth');
const ApiError = require('../utils/apiError');

router.use(auth);

// Get all discounts
router.get('/', async (req, res, next) => {
  try {
    const discounts = await Discount.find({ isActive: true }).sort('-createdAt');
    res.json({ success: true, data: discounts });
  } catch (error) {
    next(error);
  }
});

// Validate discount code
router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const discount = await Discount.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      $or: [{ startDate: null }, { startDate: { $lte: new Date() } }],
      $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
    });

    if (!discount) {
      throw new ApiError(404, 'Invalid or expired discount code');
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      throw new ApiError(400, 'Discount code has reached its usage limit');
    }

    if (subtotal < discount.minPurchase) {
      throw new ApiError(400, `Minimum purchase of $${discount.minPurchase} required`);
    }

    let discountAmount = 0;
    if (discount.type === 'PERCENTAGE') {
      discountAmount = (subtotal * discount.value) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
    } else if (discount.type === 'FIXED') {
      discountAmount = discount.value;
    }

    res.json({ success: true, data: { discount, discountAmount } });
  } catch (error) {
    next(error);
  }
});

// CRUD operations (Manager+)
router.post('/', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const discount = await Discount.create({
      ...req.body,
      code: req.body.code?.toUpperCase(),
    });
    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    await Discount.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Discount deactivated' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
