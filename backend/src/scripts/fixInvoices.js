require('dotenv').config();
const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Settings = require('../models/Settings');

const fixInvoices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all sales sorted by creation date
    const sales = await Sale.find().sort('createdAt');
    
    // Reset settings
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ invoicePrefix: 'INV', nextInvoiceNumber: 1001 });
    }
    
    let invoiceNumber = 1001;
    
    for (const sale of sales) {
      const newInvoiceNo = `${settings.invoicePrefix}-${String(invoiceNumber).padStart(6, '0')}`;
      await Sale.findByIdAndUpdate(sale._id, { invoiceNo: newInvoiceNo });
      console.log(`Updated ${sale._id} to ${newInvoiceNo}`);
      invoiceNumber++;
    }
    
    // Update settings with next number
    settings.nextInvoiceNumber = invoiceNumber;
    await settings.save();
    
    console.log(`Done! Next invoice number: ${invoiceNumber}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixInvoices();
