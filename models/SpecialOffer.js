const mongoose = require('mongoose');

const specialOfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  images: [{ type: String }],
  discount: { type: Number },
  originalPrice: { type: Number },
  offerPrice: { type: Number },
  validUntil: { type: Date },
  badge: { type: String, default: 'SALE' },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SpecialOffer', specialOfferSchema);
