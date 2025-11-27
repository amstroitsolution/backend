// backend/models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

// helper: compare password
AdminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// pre-save: hash password if modified
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Admin', AdminSchema);
