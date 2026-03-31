const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: String }, // ✅ custom ID

  qrCode: { type: String }, // ✅ QR image path

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],

  totalAmount: Number,

  shippingAddress: String,

  paymentMethod: {
    type: String,
    default: 'UPI'
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },

  orderStatus: {
    type: String,
    enum: ['Placed', 'Shipped', 'Delivered'],
    default: 'Placed'
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);