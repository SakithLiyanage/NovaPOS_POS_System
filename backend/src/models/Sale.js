const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  sku: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  lineTotal: { type: Number, required: true },
}, { _id: false });

const saleSchema = new mongoose.Schema({
  invoiceNo: { 
    type: String, 
    required: true, 
    unique: true,
    index: true,
  },
  cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [saleItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['CASH', 'CARD', 'OTHER'], required: true },
  amountPaid: { type: Number },
  changeAmount: { type: Number },
  status: { type: String, enum: ['COMPLETED', 'REFUNDED', 'CANCELLED'], default: 'COMPLETED' },
  notes: String,
}, {
  timestamps: true,
});

// Add pre-save middleware to handle duplicates
saleSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNo) {
    const Settings = mongoose.model('Settings');
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ invoicePrefix: 'INV', nextInvoiceNumber: 1001 });
    }
    
    let invoiceNo;
    let isUnique = false;
    
    while (!isUnique) {
      invoiceNo = `${settings.invoicePrefix}-${String(settings.nextInvoiceNumber).padStart(6, '0')}`;
      const existing = await this.constructor.findOne({ invoiceNo });
      if (!existing) {
        isUnique = true;
      } else {
        settings.nextInvoiceNumber += 1;
      }
    }
    
    this.invoiceNo = invoiceNo;
    settings.nextInvoiceNumber += 1;
    await settings.save();
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
