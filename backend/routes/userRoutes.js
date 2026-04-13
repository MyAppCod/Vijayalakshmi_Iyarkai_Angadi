const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');

const {
  updateProfile,
  getMyOrders,
  getAllUsers,
  updateRole,
  deleteUser
} = require('../controllers/userController');

// ✅ PROFILE ROUTES FIRST
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/profile', auth, updateProfile);

// ✅ CUSTOMER
router.get('/my-orders', auth, getMyOrders);

// ✅ ADMIN
router.get('/', auth, role('admin'), getAllUsers);
router.put('/:id/role', auth, role('admin'), updateRole);
router.delete('/:id', auth, role('admin'), deleteUser);

module.exports = router;