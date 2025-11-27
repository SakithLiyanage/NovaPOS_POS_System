const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [200, 'Name cannot exceed 200 characters'],
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  costPrice: {
    type: Number,
    default: 0,
    min: [0, 'Cost price cannot be negative'],
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative'],
  },
  taxRate: {
    type: Number,
    default: 0,
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100%'],
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Threshold cannot be negative'],
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for search
productSchema.index({ name: 'text', sku: 'text', barcode: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
