const mongoose = require('mongoose');

const kidsSectionDataSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KidsSection',
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
kidsSectionDataSchema.index({ sectionId: 1, isActive: 1 });
kidsSectionDataSchema.index({ order: 1 });

module.exports = mongoose.model('KidsSectionData', kidsSectionDataSchema);
