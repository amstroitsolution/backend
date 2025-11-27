const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['KidsProduct', 'WomenProduct', 'TrendingItem', 'NewArrival', 'BestSeller', 'FeaturedCollection', 'SpecialOffer', 'Section', 'SectionData']
  },
  productUrl: {
    type: String,
    required: false
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);