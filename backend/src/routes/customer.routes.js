const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customer.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);

router.delete('/:id', requireRole('OWNER', 'MANAGER'), deleteCustomer);

module.exports = router;
