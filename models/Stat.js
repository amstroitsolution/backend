const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Please provide a label'],
    trim: true
  },
  value: {
    type: Number,
    required: [true, 'Please provide a value'],
    min: 0
  },
  suffix: {
    type: String,
    default: '+',
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: 'from-red-600 to-amber-600'
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

module.exports = mongoose.model('Stat', statSchema);
