const mongoose = require('mongoose');

const stockEntrySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantityChange: {
    type: Number,
    required: true,
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    enum: ['PURCHASE', 'SALE', 'ADJUSTMENT', 'DAMAGE', 'RETURN', 'CORRECTION'],
    required: true,
  },
  reference: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

stockEntrySchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('StockEntry', stockEntrySchema);
