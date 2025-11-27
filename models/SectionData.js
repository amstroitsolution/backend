const mongoose = require('mongoose');

const sectionDataSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
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
sectionDataSchema.index({ sectionId: 1, isActive: 1 });

module.exports = mongoose.model('SectionData', sectionDataSchema);
