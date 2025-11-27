const mongoose = require('mongoose');

const bestSellerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  badge: {
    type: String,
    enum: ['BESTSELLER', 'HOT', 'TRENDING', 'PREMIUM', 'NEW'],
    default: 'BESTSELLER'
  },
  discount: {
    type: String
  },
  category: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BestSeller', bestSellerSchema);
