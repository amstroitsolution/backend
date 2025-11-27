const mongoose = require('mongoose');

const ourValuesSchema = new mongoose.Schema({
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
  icon: {
    type: String, // URL or path to icon image
    default: null
  },
  emoji: {
    type: String, // Emoji as fallback if no icon
    default: "⭐"
  },
  // NEW: Section image (right side image)
  sectionImage: {
    type: String, // URL or path to section image
    default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
  },
  // NEW: Section heading
  sectionHeading: {
    type: String,
    default: "Our Values"
  },
  // NEW: Section description (left side text)
  sectionDescription: {
    type: String,
    default: "The Odd Factory is dedicated to giving back to the fashion community and society."
  },
  // NEW: Section sub-description
  sectionSubDescription: {
    type: String,
    default: "Our goal is to ensure you get what you require to succeed."
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

// Index for sorting
ourValuesSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model('OurValues', ourValuesSchema);