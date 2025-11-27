const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'NovaPOS Store',
  },
  storeAddress: {
    type: String,
  },
  storePhone: {
    type: String,
  },
  storeEmail: {
    type: String,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  currencySymbol: {
    type: String,
    default: '$',
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  invoicePrefix: {
    type: String,
    default: 'INV',
  },
  nextInvoiceNumber: {
    type: Number,
    default: 1001,
  },
  showProductImages: {
    type: Boolean,
    default: true,
  },
  lowStockWarning: {
    type: Boolean,
    default: true,
  },
  receiptFooter: {
    type: String,
    default: 'Thank you for your purchase!',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
