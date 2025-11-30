const express = require('express');
const router = express.Router();
const {
  getSummary,
  getSalesByDate,
  getTopProducts,
  getSalesHeatmap,
} = require('../controllers/report.controller');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/summary', getSummary);
router.get('/sales-by-date', getSalesByDate);
router.get('/top-products', getTopProducts);
router.get('/sales-heatmap', getSalesHeatmap);

module.exports = router;
