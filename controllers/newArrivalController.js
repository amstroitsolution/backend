const NewArrival = require('../models/NewArrival');
const Inquiry = require('../models/Inquiry');
const path = require('path');
const fs = require('fs');

// Utility function to create auto-inquiries
const createAutoInquiry = async (productId, productType, title, description) => {
  try {
    const autoInquiry = new Inquiry({
      productId,
      productType,
      customerName: 'System Auto-Generated',
      customerEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@store.com',
      message: description,
      status: 'pending'
    });

    await autoInquiry.save();
    console.log(`Auto-inquiry created: ${title}`);
    return autoInquiry;
  } catch (error) {
    console.error('Failed to create auto-inquiry:', error);
    return null;
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await NewArrival.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await NewArrival.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'New Arrival not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => f.path || f.url) : [];
    const item = new NewArrival({ ...req.body, images });
    await item.save();

    // Auto-create inquiry for new arrival
    await createAutoInquiry(
      item._id,
      'NewArrival',
      `New Arrival: ${item.title}`,
      `Auto-generated inquiry for new arrival "${item.title}". Price: ₹${item.price || 'Not specified'}. Created on ${new Date().toLocaleDateString()}. This new arrival may need review or promotional setup.`
    );

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const newImages = req.files ? req.files.map(f => f.path || f.url) : [];
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const images = [...existingImages, ...newImages];

    const item = await NewArrival.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await NewArrival.findById(req.params.id);
    if (item && item.images) {
      item.images.forEach(img => {
        if (img.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), img);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) { console.error('Local delete failed:', e); }
          }
        }
      });
    }
    await NewArrival.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
