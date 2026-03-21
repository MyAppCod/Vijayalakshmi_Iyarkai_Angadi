const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber:     { type: String, unique: true },
  items: [
    {
      product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:      String,
      quantity:  Number,
      unitPrice: Number,
      subtotal:  Number
    }
  ],
  totalAmount:    { type: Number, required: true },
  discount:       { type: Number, default: 0 },
  payableAmount:  { type: Number, required: true },
  paymentMethod:  { type: String, enum: ['cash', 'upi', 'card'], default: 'cash' },
  customerName:   { type: String },
  customerPhone:  { type: String },
  servedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
