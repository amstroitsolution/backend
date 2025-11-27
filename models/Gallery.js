// backend/models/Gallery.js
const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },   // stored as paths like /uploads/...
    coverImage: { type: String, default: '' }, // optional explicit cover
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', GallerySchema);
