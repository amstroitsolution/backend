const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please provide a role/designation'],
    trim: true
  },
  quote: {
    type: String,
    required: [true, 'Please provide a testimonial quote'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  company: {
    type: String,
    trim: true
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

module.exports = mongoose.model('Testimonial', testimonialSchema);
