const mongoose = require('mongoose');

const kidsProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Boys', 'Girls']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  categorySlug: {
    type: String,
    trim: true,
    index: true
  },
  images: [{
    type: String
  }],
  price: {
    type: Number
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  sizes: [{
    type: String
  }],
  colors: [{
    type: String
  }],
  material: {
    type: String,
    trim: true
  },
  ageGroup: {
    type: String,
    enum: ['0-2 years', '2-4 years', '4-6 years', '6-8 years', '8-10 years', '10-12 years', '12-14 years']
  },
  stock: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    trim: true
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
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('KidsProduct', kidsProductSchema);
