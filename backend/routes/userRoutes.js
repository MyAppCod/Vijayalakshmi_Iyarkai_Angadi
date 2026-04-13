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


// ✅ GET USER PROFILE
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
