const mongoose = require('mongoose');

const cashDrawerSchema = new mongoose.Schema({
  openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  openingBalance: { type: Number, required: true },
  closingBalance: { type: Number },
  expectedBalance: { type: Number },
  difference: { type: Number },
  cashSales: { type: Number, default: 0 },
  cardSales: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  refundsTotal: { type: Number, default: 0 },
  notes: String,
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
  openedAt: { type: Date, default: Date.now },
  closedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('CashDrawer', cashDrawerSchema);
