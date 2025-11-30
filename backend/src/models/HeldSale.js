const mongoose = require('mongoose');

const heldSaleSchema = new mongoose.Schema({
  heldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    sku: String,
    quantity: Number,
    price: Number,
    taxRate: Number,
  }],
  discount: { type: Number, default: 0 },
  notes: String,
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
}, { timestamps: true });

heldSaleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('HeldSale', heldSaleSchema);
