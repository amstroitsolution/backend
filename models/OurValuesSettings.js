const mongoose = require('mongoose');

const ourValuesSettingsSchema = new mongoose.Schema({
  // Section heading
  sectionHeading: {
    type: String,
    default: "Our Values"
  },
  // Left side main description
  mainDescription: {
    type: String,
    default: "The Odd Factory is dedicated to giving back to the fashion community and society. We've created a unified platform that offers something for everyone—whether you're a brand, startup, or service provider. Committed to ethical and sustainable production, we're here to help you build a conscious brand and supply chain."
  },
  // Left side sub description
  subDescription: {
    type: String,
    default: "Our goal is to ensure you get what you require to succeed. Together, let's shape a future of responsible fashion, where innovation and sustainability go hand in hand. We distribute a % of our proceeds to our animal welfare NGO, Stranduary Foundation. If you wish to give back to society, the planet or the industry, please connect with our team."
  },
  // Right side image
  sectionImage: {
    type: String,
    default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
  },
  // Image alt text
  imageAlt: {
    type: String,
    default: "Our Values - Team Working"
  },
  // Is section active
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OurValuesSettings', ourValuesSettingsSchema);
