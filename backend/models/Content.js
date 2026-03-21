const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  order: Number
});

const themeSchema = new mongoose.Schema({
  name: String, // light, dark, pongal

  logo: String,
  banner: String,

  primaryColor: String,
  secondaryColor: String,

  isActive: {
    type: Boolean,
    default: false
  }
});

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    enum: ['home', 'about'],
    required: true
  },
   logo: String,
  sections: [sectionSchema],
    themes: [themeSchema],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);