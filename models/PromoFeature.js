const mongoose = require('mongoose');

const promoFeatureSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    enum: ['FaTruck', 'FaUndo', 'FaShieldAlt', 'FaGift', 'FaHeart', 'FaStar', 'FaPhone', 'FaClock']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  colorGradient: {
    type: String,
    default: 'from-blue-500 to-cyan-500'
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

module.exports = mongoose.model('PromoFeature', promoFeatureSchema);
