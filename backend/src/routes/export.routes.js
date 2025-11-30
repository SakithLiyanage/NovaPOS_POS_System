const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { auth, requireRole } = require('../middleware/auth');
const { generateCSV, generateReceiptHTML } = require('../utils/exportUtils');

router.use(auth);

// Export sales as CSV
router.get('/sales', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'COMPLETED' };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + 'T23:59:59');
    }

    const sales = await Sale.find(query)
      .populate('cashier', 'name')
      .populate('customer', 'name')
      .sort('-createdAt')
      .lean();

    // Generate CSV
    const headers = 'Invoice,Date,Cashier,Customer,Subtotal,Discount,Tax,Total,Payment\n';
    const rows = sales.map(s => {
      return [
        s.invoiceNo,
        new Date(s.createdAt).toISOString().split('T')[0],
        s.cashier?.name || 'N/A',
        s.customer?.name || 'Walk-in',
        s.subtotal?.toFixed(2) || '0.00',
        s.discount || 0,
        s.taxAmount?.toFixed(2) || '0.00',
        s.grandTotal?.toFixed(2) || '0.00',
        s.paymentMethod,
      ].join(',');
    }).join('\n');

    const csv = headers + rows;

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

    const headers = 'Name,SKU,Barcode,Category,Brand,Cost,Price,Stock,Status\n';
    const rows = products.map(p => {
      return [
        `"${p.name}"`,
        p.sku,
        p.barcode || '',
        p.category?.name || '',
        p.brand?.name || '',
        p.costPrice?.toFixed(2) || '0.00',
        p.salePrice?.toFixed(2) || '0.00',
        p.currentStock || 0,
        p.isActive ? 'Active' : 'Inactive',
      ].join(',');
    }).join('\n');

    const csv = headers + rows;

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
