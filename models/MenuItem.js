const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  hasDropdown: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
