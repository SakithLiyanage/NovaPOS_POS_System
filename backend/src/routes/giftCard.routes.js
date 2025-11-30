const express = require('express');
const router = express.Router();
const GiftCard = require('../models/GiftCard');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const cards = await GiftCard.find().sort('-createdAt');
    res.json({ success: true, data: cards });
  } catch (error) {
    next(error);
  }
});

router.get('/check/:code', async (req, res, next) => {
  try {
    const card = await GiftCard.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!card) return res.status(404).json({ success: false, message: 'Gift card not found' });
    if (card.expiryDate && card.expiryDate < new Date()) {
      return res.status(400).json({ success: false, message: 'Gift card has expired' });
    }
    res.json({ success: true, data: { code: card.code, balance: card.currentBalance } });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const code = GiftCard.generateCode();
    const card = await GiftCard.create({
      code,
      initialBalance: req.body.amount,
      currentBalance: req.body.amount,
      purchasedBy: req.body.customerId,
      expiryDate: req.body.expiryDate,
      transactions: [{ type: 'PURCHASE', amount: req.body.amount, balanceAfter: req.body.amount }],
    });
    res.status(201).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
});

router.post('/redeem', async (req, res, next) => {
  try {
    const { code, amount, reference } = req.body;
    const card = await GiftCard.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!card) return res.status(404).json({ success: false, message: 'Gift card not found' });
    if (card.currentBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    card.currentBalance -= amount;
    card.transactions.push({ type: 'REDEEM', amount: -amount, balanceAfter: card.currentBalance, reference });
    await card.save();

    res.json({ success: true, data: { remainingBalance: card.currentBalance } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
