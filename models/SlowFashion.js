const mongoose = require('mongoose');

const slowFashionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // URL or path to image
    required: true
  },
  category: {
    type: String,
    default: "Fashion",
    trim: true
  },
  buttonText: {
    type: String,
    default: "Explore More",
    trim: true
  },
  buttonLink: {
    type: String,
    default: "#",
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
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

// Index for sorting
slowFashionSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model('SlowFashion', slowFashionSchema);