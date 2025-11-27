const mongoose = require('mongoose');

const shopCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  image: {
    type: String
  },
  link: {
    type: String,
    required: true
  },
  colorGradient: {
    type: String,
    default: 'from-pink-500 to-rose-500'
  },
  itemsCount: {
    type: String
  },
  badge: {
    type: String,
    default: 'NEW'
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

module.exports = mongoose.model('ShopCategory', shopCategorySchema);
