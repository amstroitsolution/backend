const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['saree', 'lehenga'], required: true },
  price: { type: Number, required: true },
  images: [String],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
