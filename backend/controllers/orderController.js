const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Finance = require('../models/Finance');

// 🛒 Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    let total = 0;

    const items = cart.items.map(item => {
      total += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity
      };
    });

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount: total,
      shippingAddress
    });

    await order.save();

    // Auto-log income in Finance
    await Finance.create({
      type: 'income', category: 'sales', amount: total,
      description: `Online order #${order._id}`,
      source: 'online', referenceId: order._id.toString(),
      recordedBy: req.user.id
    });

    // ✅ Clear cart after order
    cart.items = [];
    await cart.save();

    res.json({
      order,
      upiId: process.env.UPI_ID
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📥 Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🧑‍💼 Admin: Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};