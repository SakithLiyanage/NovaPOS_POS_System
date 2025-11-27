const express = require('express');
const router = express.Router();
const { getSales, getSale, createSale } = require('../controllers/sale.controller');
const { processRefund } = require('../controllers/refund.controller');
const { auth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createSaleSchema } = require('../validations/sale.validation');

router.use(auth);

router.get('/', getSales);
router.get('/:id', getSale);
router.post('/', validate(createSaleSchema), createSale);
router.post('/:id/refund', requireRole('OWNER', 'MANAGER'), processRefund);

module.exports = router;
