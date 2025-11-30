const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['RENT', 'UTILITIES', 'SALARIES', 'SUPPLIES', 'MAINTENANCE', 'MARKETING', 'OTHER'] },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  vendor: String,
  receiptNo: String,
  paymentMethod: { type: String, enum: ['CASH', 'CARD', 'BANK_TRANSFER', 'CHECK'] },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [String],
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
