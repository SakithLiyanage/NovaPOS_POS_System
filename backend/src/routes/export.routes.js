const express = require('express');
const router = express.Router();
const { Sale, Product, Settings } = require('../models');
const { auth, requireRole } = require('../middleware/auth');
const { generateCSV, generateReceiptHTML } = require('../utils/exportUtils');

router.use(auth);

// Export sales as CSV
router.get('/sales', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const query = { status: 'COMPLETED' };
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59');
    }

    const sales = await Sale.find(query)
      .populate('cashier', 'name')
      .populate('customer', 'name')
      .sort('-createdAt')
      .lean();

    const columns = [
      { key: 'invoiceNo', label: 'Invoice' },
      { key: 'createdAt', label: 'Date', format: 'date' },
      { key: 'cashier.name', label: 'Cashier' },
      { key: 'customer.name', label: 'Customer' },
      { key: 'subtotal', label: 'Subtotal', format: 'currency' },
      { key: 'discount', label: 'Discount %' },
      { key: 'taxAmount', label: 'Tax', format: 'currency' },
      { key: 'grandTotal', label: 'Total', format: 'currency' },
      { key: 'paymentMethod', label: 'Payment' },
    ];

    const csv = generateCSV(sales, columns);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=sales_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

// Export products as CSV
router.get('/products', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('brand', 'name')
      .sort('name')
      .lean();

    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'sku', label: 'SKU' },
      { key: 'barcode', label: 'Barcode' },
      { key: 'category.name', label: 'Category' },
      { key: 'brand.name', label: 'Brand' },
      { key: 'costPrice', label: 'Cost', format: 'currency' },
      { key: 'salePrice', label: 'Price', format: 'currency' },
      { key: 'currentStock', label: 'Stock' },
      { key: 'isActive', label: 'Active' },
    ];

    const csv = generateCSV(products, columns);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=products_export_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

// Get receipt HTML
router.get('/receipt/:saleId', async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.saleId)
      .populate('cashier', 'name')
      .populate('customer', 'name');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const settings = await Settings.findOne();
    const html = generateReceiptHTML(sale, settings);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
