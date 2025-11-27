const express = require('express');
const router = express.Router();
const {
  getSummary,
  getSalesByDate,
  getTopProducts,
  getSalesByCategory,
  getSalesHeatmap,
} = require('../controllers/report.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/summary', getSummary);
router.get('/sales-by-date', getSalesByDate);
router.get('/top-products', getTopProducts);
router.get('/sales-heatmap', getSalesHeatmap);
router.get('/sales-by-category', requireRole('OWNER', 'MANAGER'), getSalesByCategory);

module.exports = router;
