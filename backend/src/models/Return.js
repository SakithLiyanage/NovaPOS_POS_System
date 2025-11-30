const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  originalSale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  returnNo: { type: String, required: true, unique: true },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    unitPrice: Number,
    returnAmount: Number,
    reason: String,
    condition: { type: String, enum: ['RESELLABLE', 'DAMAGED', 'DEFECTIVE'] },
  }],
  subtotal: Number,
  taxAmount: Number,
  totalRefund: { type: Number, required: true },
  refundMethod: { type: String, enum: ['CASH', 'CARD', 'STORE_CREDIT', 'ORIGINAL'], required: true },
  reason: { type: String, required: true },
  notes: String,
  status: { type: String, enum: ['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'], default: 'COMPLETED' },
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
