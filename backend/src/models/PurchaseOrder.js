const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    sku: String,
    quantity: Number,
    unitCost: Number,
    receivedQty: { type: Number, default: 0 },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'PARTIAL', 'RECEIVED', 'CANCELLED'], default: 'PENDING' },
  expectedDate: Date,
  receivedDate: Date,
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
