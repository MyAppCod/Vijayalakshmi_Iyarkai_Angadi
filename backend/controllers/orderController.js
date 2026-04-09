const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Finance = require('../models/Finance');
const QRCode = require('qrcode');

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
    // ✅ Generate custom Order ID
    const customOrderId = `ORD-${Date.now()}`;

    // ✅ Generate QR Code (UPI payment link)
    const upiLink = `upi://pay?pa=${process.env.UPI_ID}&pn=Vignesh&mc=${total}&mode=02&purpose=00`;

const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
    const order = new Order({
       user: req.user.id,
      orderId: customOrderId,
      qrCode: qrImage,
       upiId: process.env.UPI_ID, // ✅ ADD THIS
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
      .populate('user', 'name email phone')
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

    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.orderStatus = status;

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.paymentStatus = paymentStatus;

    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};