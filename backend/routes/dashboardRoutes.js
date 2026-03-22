const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const users = await User.countDocuments();

    // Orders grouped by date
    const ordersByDate = await Order.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$totalPrice" }  // Make sure your field matches the schema
        }
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } }
    ]);

    // Format for frontend
    const chartData = ordersByDate.map(item => ({
      name: `${item._id.day}/${item._id.month}`,
      revenue: item.total
    }));

    const revenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

    res.json({
      products,
      orders,
      users,
      revenue,
      chartData
    });

  } catch (err) {
    console.error('Dashboard route error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;