const mongoose = require('mongoose');

const kidsHeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please provide an image']
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

module.exports = mongoose.model('KidsHero', kidsHeroSchema);
