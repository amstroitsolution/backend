const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  parentSubmenuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubMenuItem',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
subCategorySchema.index({ parentSubmenuId: 1, order: 1 });
subCategorySchema.index({ slug: 1 });

module.exports = mongoose.model('SubCategory', subCategorySchema);
