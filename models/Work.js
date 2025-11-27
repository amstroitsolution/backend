// backend/models/Work.js
const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  longDescription: { type: String },
  category: { type: String, default: 'General' },
  images: [{ type: String }], // stored paths like /uploads/works/filename.jpg
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Work', WorkSchema);
