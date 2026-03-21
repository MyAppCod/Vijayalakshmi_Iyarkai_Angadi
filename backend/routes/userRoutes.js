const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { updateProfile, getMyOrders, getAllUsers, updateRole, deleteUser } = require('../controllers/userController');

// Customer routes
router.put('/profile', auth, updateProfile);
router.get('/my-orders', auth, getMyOrders);

// Admin-only routes
router.get('/', auth, role('admin'), getAllUsers);
router.put('/:id/role', auth, role('admin'), updateRole);
router.delete('/:id', auth, role('admin'), deleteUser);

module.exports = router;
