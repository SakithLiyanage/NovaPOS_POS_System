const express = require('express');
const router = express.Router();
const { Product, Sale, Customer } = require('../models');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(q, 'i');
    const results = [];

    // Search products
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { sku: searchRegex },
        { barcode: searchRegex },
      ],
    }).limit(5);

    products.forEach(p => {
      results.push({
        type: 'product',
        id: p._id,
        title: p.name,
        subtitle: `SKU: ${p.sku} • $${p.salePrice}`,
      });
    });

    // Search sales
    const sales = await Sale.find({
      invoiceNo: searchRegex,
    }).limit(5);

    sales.forEach(s => {
      results.push({
        type: 'sale',
        id: s._id,
        title: s.invoiceNo,
        subtitle: `$${s.grandTotal} • ${new Date(s.createdAt).toLocaleDateString()}`,
      });
    });

    // Search customers
    const customers = await Customer.find({
      $or: [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ],
    }).limit(5);

    customers.forEach(c => {
      results.push({
        type: 'customer',
        id: c._id,
        title: c.name,
        subtitle: c.phone || c.email || 'No contact info',
      });
    });

    res.json({ success: true, data: results.slice(0, 10) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
