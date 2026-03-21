const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
  addToCart,
  getCart,
  removeItem,
  updateQuantity
} = require('../controllers/cartController');

router.post('/', auth, addToCart);
router.get('/', auth, getCart);
router.put('/', auth, updateQuantity);
router.delete('/:productId', auth, removeItem);

module.exports = router;