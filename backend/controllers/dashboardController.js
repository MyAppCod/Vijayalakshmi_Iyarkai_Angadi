// controllers/dashboardController.js
const Product = require('../models/Product');
const Order = require('../models/Order'); // assuming you have an Order model
const User = require('../models/User');   // assuming you have a User model

exports.getDashboard = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();

    // Monthly revenue aggregation
    const orders = await Order.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthData = orders.find(o => o._id === month);
      return {
        name: new Date(0, month - 1).toLocaleString('en-US', { month: 'short' }),
        revenue: monthData ? monthData.revenue : 0
      };
    });

    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);

    res.status(200).json({
      products: productsCount,
      orders: ordersCount,
      users: usersCount,
      revenue: totalRevenue,
      chartData
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};