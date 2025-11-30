const express = require('express');
const router = express.Router();
const CashDrawer = require('../models/CashDrawer');
const Sale = require('../models/Sale');
const { auth, requireRole } = require('../middleware/auth');
const ApiError = require('../utils/apiError');

router.use(auth);

// Get current open drawer
router.get('/current', async (req, res, next) => {
  try {
    const drawer = await CashDrawer.findOne({ status: 'OPEN' })
      .populate('openedBy', 'name');
    res.json({ success: true, data: drawer });
  } catch (error) {
    next(error);
  }
});

// Open drawer
router.post('/open', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const existing = await CashDrawer.findOne({ status: 'OPEN' });
    if (existing) {
      throw new ApiError(400, 'A cash drawer is already open');
    }

    const drawer = await CashDrawer.create({
      openedBy: req.user._id,
      openingBalance: req.body.openingBalance || 0,
      notes: req.body.notes,
    });

    res.status(201).json({ success: true, data: drawer });
  } catch (error) {
    next(error);
  }
});

// Close drawer
router.post('/close', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const drawer = await CashDrawer.findOne({ status: 'OPEN' });
    if (!drawer) {
      throw new ApiError(400, 'No open cash drawer found');
    }

    // Calculate sales during this session
    const sales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: drawer.openedAt },
          status: 'COMPLETED',
        },
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$grandTotal' },
          count: { $sum: 1 },
        },
      },
    ]);

    const cashSales = sales.find(s => s._id === 'CASH')?.total || 0;
    const cardSales = sales.find(s => s._id === 'CARD')?.total || 0;
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const salesCount = sales.reduce((sum, s) => sum + s.count, 0);

    const expectedBalance = drawer.openingBalance + cashSales;
    const closingBalance = req.body.closingBalance || expectedBalance;
    const difference = closingBalance - expectedBalance;

    drawer.closedBy = req.user._id;
    drawer.closingBalance = closingBalance;
    drawer.expectedBalance = expectedBalance;
    drawer.difference = difference;
    drawer.cashSales = cashSales;
    drawer.cardSales = cardSales;
    drawer.totalSales = totalSales;
    drawer.salesCount = salesCount;
    drawer.status = 'CLOSED';
    drawer.closedAt = new Date();
    drawer.notes = req.body.notes || drawer.notes;

    await drawer.save();

    res.json({ success: true, data: drawer });
  } catch (error) {
    next(error);
  }
});

// Get drawer history
router.get('/history', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const drawers = await CashDrawer.find()
      .populate('openedBy', 'name')
      .populate('closedBy', 'name')
      .sort('-openedAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CashDrawer.countDocuments();
    res.json({ success: true, data: drawers, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
