const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pointsPerDollar: { type: Number, default: 1 },
  pointsRedemptionRate: { type: Number, default: 0.01 },
  minPointsRedemption: { type: Number, default: 100 },
  tiers: [{
    name: String,
    minPoints: Number,
    multiplier: { type: Number, default: 1 },
    benefits: [String],
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const customerLoyaltySchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  points: { type: Number, default: 0 },
  lifetimePoints: { type: Number, default: 0 },
  tier: { type: String, default: 'Bronze' },
  history: [{
    type: { type: String, enum: ['EARNED', 'REDEEMED', 'ADJUSTED', 'EXPIRED'] },
    points: Number,
    reference: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = {
  LoyaltyProgram: mongoose.model('LoyaltyProgram', loyaltyProgramSchema),
  CustomerLoyalty: mongoose.model('CustomerLoyalty', customerLoyaltySchema),
};
