const express = require('express');
const router = express.Router();
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brand.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', getBrands);

router.use(requireRole('OWNER', 'MANAGER'));

router.post('/', createBrand);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
