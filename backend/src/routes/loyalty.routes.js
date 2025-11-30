const express = require('express');
const router = express.Router();
const { LoyaltyProgram, CustomerLoyalty } = require('../models/LoyaltyProgram');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/program', async (req, res, next) => {
  try {
    const program = await LoyaltyProgram.findOne({ isActive: true });
    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
});

router.get('/customer/:customerId', async (req, res, next) => {
  try {
    let loyalty = await CustomerLoyalty.findOne({ customer: req.params.customerId });
    if (!loyalty) {
      loyalty = await CustomerLoyalty.create({ customer: req.params.customerId });
    }
    res.json({ success: true, data: loyalty });
  } catch (error) {
    next(error);
  }
});

router.post('/earn', async (req, res, next) => {
  try {
    const { customerId, amount, reference } = req.body;
    const program = await LoyaltyProgram.findOne({ isActive: true });
    if (!program) return res.json({ success: true, data: { pointsEarned: 0 } });

    let loyalty = await CustomerLoyalty.findOne({ customer: customerId });
    if (!loyalty) {
      loyalty = new CustomerLoyalty({ customer: customerId });
    }

    const pointsEarned = Math.floor(amount * program.pointsPerDollar);
    loyalty.points += pointsEarned;
    loyalty.lifetimePoints += pointsEarned;
    loyalty.history.push({ type: 'EARNED', points: pointsEarned, reference, description: `Earned from purchase` });

    const tier = program.tiers.slice().reverse().find(t => loyalty.lifetimePoints >= t.minPoints);
    if (tier) loyalty.tier = tier.name;

    await loyalty.save();
    res.json({ success: true, data: { pointsEarned, totalPoints: loyalty.points, tier: loyalty.tier } });
  } catch (error) {
    next(error);
  }
});

router.post('/redeem', async (req, res, next) => {
  try {
    const { customerId, points, reference } = req.body;
    const program = await LoyaltyProgram.findOne({ isActive: true });
    
    const loyalty = await CustomerLoyalty.findOne({ customer: customerId });
    if (!loyalty || loyalty.points < points) {
      return res.status(400).json({ success: false, message: 'Insufficient points' });
    }
    if (points < program.minPointsRedemption) {
      return res.status(400).json({ success: false, message: `Minimum ${program.minPointsRedemption} points required` });
    }

    const discountAmount = points * program.pointsRedemptionRate;
    loyalty.points -= points;
    loyalty.history.push({ type: 'REDEEMED', points: -points, reference, description: `Redeemed for $${discountAmount}` });
    await loyalty.save();

    res.json({ success: true, data: { discountAmount, remainingPoints: loyalty.points } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
