const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative'],
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  lineTotal: {
    type: Number,
    required: true,
  },
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
    unique: true,
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  items: [saleItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
    min: [0, 'Grand total cannot be negative'],
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CARD', 'OTHER'],
    required: true,
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'REFUNDED', 'CANCELLED'],
    default: 'COMPLETED',
  },
  notes: String,
}, {
  timestamps: true,
});

// Indexes
saleSchema.index({ invoiceNo: 1 });
saleSchema.index({ createdAt: -1 });
saleSchema.index({ cashier: 1 });
saleSchema.index({ customer: 1 });

module.exports = mongoose.model('Sale', saleSchema);
