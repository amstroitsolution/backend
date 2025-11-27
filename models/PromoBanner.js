const mongoose = require('mongoose');

const promoBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonLink: {
    type: String,
    default: '#'
  },
  backgroundImage: {
    type: String
  },
  discountPercentage: {
    type: Number
  },
  validUntil: {
    type: Date
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

module.exports = mongoose.model('PromoBanner', promoBannerSchema);
