const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin / Manager
router.post('/', auth, role('admin', 'manager'), upload.single('image'), createProduct);
router.put('/:id', auth, role('admin', 'manager'), updateProduct);
router.delete('/:id', auth, role('admin'), deleteProduct);

module.exports = router;