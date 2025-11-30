const express = require('express');
const router = express.Router();
const {
  adjustStock,
  getLowStock,
  getStockHistory,
} = require('../controllers/inventory.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/low-stock', getLowStock);
router.get('/history', getStockHistory);
router.post('/adjust', requireRole('OWNER', 'MANAGER'), adjustStock);

module.exports = router;
