const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);
router.use(requireRole('OWNER', 'MANAGER'));

router.get('/', async (req, res, next) => {
  try {
    const { startDate, endDate, category } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate + 'T23:59:59');
    }
    if (category) query.category = category;

    const expenses = await Expense.find(query).populate('createdBy', 'name').sort('-date');
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    res.json({ success: true, data: expenses, summary: { total, count: expenses.length } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
});

router.get('/summary', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate) match.date = { $gte: new Date(startDate) };
    if (endDate) match.date = { ...match.date, $lte: new Date(endDate + 'T23:59:59') };

    const summary = await Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
