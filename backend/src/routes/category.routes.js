const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', getCategories);
router.get('/:id', getCategory);

router.use(requireRole('OWNER', 'MANAGER'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
