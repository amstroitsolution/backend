// backend/routes/equipment.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const Equipment = require('../models/Equipment');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// ===== debug middleware
router.use((req, res, next) => {
  console.log('🔎 EQUIP ROUTER REQ:', req.method, req.originalUrl);
  next();
});

// Helper: remove uploaded file safely
async function removeFileIfExists(relativePath) {
  if (!relativePath) return;
  try {
    const filename = path.basename(relativePath);
    const p = path.join(__dirname, '..', 'uploads', filename);
    await fs.access(p);
    await fs.unlink(p);
    console.log('Deleted file:', p);
  } catch (err) {
    console.warn('⚠️ removeFileIfExists warning:', err.message);
  }
}

// ==== GET all equipments
router.get('/', async (req, res) => {
  try {
    const items = await Equipment.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('GET /api/equipment error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==== GET single equipment
router.get('/:id', async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.json(item);
  } catch (err) {
    console.error('GET /api/equipment/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ==== POST add new equipment
router.post('/', auth, upload.single('image'), async (req, res) => {
  console.log('Headers content-type:', req.headers['content-type']);
  console.log('req.body:', req.body, 'req.file:', !!req.file);

  try {
    const { title, description, details, price, type } = req.body;
    if (!title || !type) {
      return res.status(400).json({ message: 'title and type are required' });
    }

    // Safe numeric conversion
    let safePrice = 0;
    if (price !== undefined && price !== null && price !== '') {
      const parsed = Number(price);
      if (isNaN(parsed)) {
        return res.status(400).json({ message: 'Invalid price format' });
      }
      safePrice = parsed;
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newItem = new Equipment({
      title,
      description: description || '',
      details: details || '',
      price: safePrice,
      type,
      images: imagePath ? [imagePath] : [],
      available: true,
    });

    await newItem.save();
    return res.status(201).json({ message: 'Equipment added', item: newItem });
  } catch (err) {
    console.error('❌ POST /api/equipment error:', err);
    // catch mongoose validation errors separately
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', error: err.message });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==== PUT update existing equipment
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, details, price, type, available } = req.body;

    const item = await Equipment.findById(id);
    if (!item) return res.status(404).json({ message: 'Equipment not found' });

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (details !== undefined) item.details = details;
    if (price !== undefined) {
      const parsed = Number(price);
      if (isNaN(parsed)) return res.status(400).json({ message: 'Invalid price format' });
      item.price = parsed;
    }
    if (type !== undefined) item.type = type;
    if (available !== undefined) item.available = available === 'true' || available === true;

    if (req.file) {
      if (item.images && item.images.length > 0) {
        await Promise.all(item.images.map(p => removeFileIfExists(p)));
      }
      item.images = [`/uploads/${req.file.filename}`];
    }

    await item.save();
    return res.json({ message: 'Equipment updated', item });
  } catch (err) {
    console.error('❌ PUT /api/equipment/:id error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==== DELETE equipment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Equipment.findById(id);
    if (!item) return res.status(404).json({ message: 'Equipment not found' });

    const imagesToDelete = Array.isArray(item.images) ? [...item.images] : [];
    const deleted = await Equipment.findByIdAndDelete(id);
    console.log(`✅ Equipment deleted: ${id}`);

    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(p => removeFileIfExists(p)));
    }

    return res.json({ message: 'Equipment deleted' });
  } catch (err) {
    console.error('❌ DELETE /api/equipment/:id error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
