const mongoose = require('mongoose');

const newArrivalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  images: [{ type: String }],
  category: { type: String },
  price: { type: Number },
  badge: { type: String, default: 'NEW' },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('NewArrival', newArrivalSchema);
