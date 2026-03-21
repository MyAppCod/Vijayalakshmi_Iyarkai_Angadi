const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: {
    type: String,
    enum: ['rice', 'millets', 'dairy', 'others'],
    required: true
  },

  price: { type: Number, required: true },

  stock: { type: Number, default: 0 },

  description: String,

  image: String, // URL (Cloudinary or local)

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);