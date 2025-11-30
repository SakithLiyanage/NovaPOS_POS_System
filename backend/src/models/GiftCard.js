const mongoose = require('mongoose');
const crypto = require('crypto');

const giftCardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  initialBalance: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  expiryDate: Date,
  isActive: { type: Boolean, default: true },
  transactions: [{
    type: { type: String, enum: ['PURCHASE', 'REDEEM', 'RELOAD', 'REFUND'] },
    amount: Number,
    balanceAfter: Number,
    reference: String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

giftCardSchema.statics.generateCode = function() {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

module.exports = mongoose.model('GiftCard', giftCardSchema);
