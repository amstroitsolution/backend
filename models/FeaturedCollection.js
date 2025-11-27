const mongoose = require('mongoose');

const featuredCollectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  images: [{ type: String }],
  category: { type: String },
  price: { type: Number },
  discount: { type: Number },
  badge: { type: String },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FeaturedCollection', featuredCollectionSchema);
