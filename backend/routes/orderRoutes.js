const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,   // ✅ ADD THIS
  updatePaymentStatus
} = require('../controllers/orderController');

// ==============================
// 👤 CUSTOMER ROUTES
// ==============================

// Place order
router.post('/', auth, placeOrder);

// Get logged-in user's orders
router.get('/my', auth, getMyOrders);


// ==============================
// 🧑‍💼 ADMIN ROUTES
// ==============================

// Get all orders
router.get('/', auth, role('admin'), getAllOrders);

// ✅ Update order status (NEW)
router.put('/:id', auth, role('admin'), updateOrderStatus);

router.put('/payment/:id', auth, role('admin'), updatePaymentStatus);



module.exports = router;