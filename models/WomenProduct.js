const mongoose = require('mongoose');

const womenProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  categorySlug: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  images: [{
    type: String
  }],
  price: {
    type: Number
  },
  sizes: [{
    type: String
  }],
  colors: [{
    type: String
  }],
  material: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WomenProduct', womenProductSchema);
