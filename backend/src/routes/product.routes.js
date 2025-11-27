const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { importProducts } = require('../controllers/import.controller');
const { auth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProductSchema, updateProductSchema } = require('../validations/product.validation');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(auth);

router.get('/', getProducts);
router.get('/:id', getProduct);

router.use(requireRole('OWNER', 'MANAGER'));

router.post('/', validate(createProductSchema), createProduct);
router.post('/import', upload.single('file'), importProducts);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
