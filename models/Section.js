const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '📦'
  },
  type: {
    type: String,
    enum: ['product', 'content', 'gallery', 'custom'],
    default: 'custom'
  },
  fields: [{
    name: String,
    label: String,
    type: {
      type: String,
      enum: ['text', 'textarea', 'number', 'image', 'images', 'boolean', 'select', 'date'],
      default: 'text'
    },
    required: Boolean,
    options: [String] // For select type
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  showOnFrontend: {
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

module.exports = mongoose.model('Section', sectionSchema);
