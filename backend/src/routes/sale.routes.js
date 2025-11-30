const express = require('express');
const router = express.Router();
const { getSales, getSale, createSale } = require('../controllers/sale.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', getSales);
router.get('/:id', getSale);
router.post('/', createSale);

// Refund route (if controller exists)
try {
  const { processRefund } = require('../controllers/refund.controller');
  router.post('/:id/refund', requireRole('OWNER', 'MANAGER'), processRefund);
} catch (e) {
  // Refund controller not available
}

module.exports = router;
