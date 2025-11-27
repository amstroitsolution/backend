const mongoose = require('mongoose');

const topStripSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    default: 'Free Shipping on Orders Above ₹999 | Easy Returns | 24/7 Customer Support'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TopStrip', topStripSchema);
