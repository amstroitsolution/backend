// backend/models/Equipment.js
const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    details: { type: String, default: '' }, // 🆕 new field for long details / specs
    type: { type: String, enum: ['saree', 'lehenga'], required: true },
    price: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', EquipmentSchema);
