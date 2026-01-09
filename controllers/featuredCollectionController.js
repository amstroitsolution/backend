const FeaturedCollection = require('../models/FeaturedCollection');
const path = require('path');
const fs = require('fs');

exports.getAll = async (req, res) => {
  try {
    const items = await FeaturedCollection.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const images = req.files ? req.files.map(f => f.path || f.url) : [];
    const item = new FeaturedCollection({ ...req.body, images });
    await item.save();
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

    const item = await FeaturedCollection.findByIdAndUpdate(
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
    const item = await FeaturedCollection.findById(req.params.id);
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
    await FeaturedCollection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
