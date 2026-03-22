const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: String,
    enum: ['rice', 'millets', 'dairy', 'others'],
    required: true
  },

  price: { type: Number, required: true },

  oldPrice: { type: Number }, // ✅ NEW

  stock: { type: Number, default: 0 },

  unit: {                    // ✅ NEW
    type: String,
    enum: ['kg', 'liter', 'count'],
    default: 'count'
  },

  message: { type: String }, // ✅ NEW

  description: String,

  image: String,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);