const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, sparse: true },
  type: { type: String, enum: ['PERCENTAGE', 'FIXED', 'BUY_X_GET_Y'], required: true },
  value: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  applicableTo: { type: String, enum: ['ALL', 'CATEGORY', 'PRODUCT'], default: 'ALL' },
  applicableItems: [{ type: mongoose.Schema.Types.ObjectId }],
  startDate: Date,
  endDate: Date,
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
