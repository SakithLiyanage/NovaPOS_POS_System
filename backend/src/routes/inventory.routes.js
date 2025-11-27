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

router.use(requireRole('OWNER', 'MANAGER'));

router.post('/adjust', adjustStock);

module.exports = router;
