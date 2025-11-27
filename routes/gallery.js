// backend/routes/gallery.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const Gallery = require('../models/Gallery');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// debug middleware
router.use((req, res, next) => {
  console.log('🔎 GALLERY ROUTER REQ:', req.method, req.originalUrl);
  next();
});

// Helper: remove uploaded file (promise)
async function removeFileIfExists(relativePath) {
  if (!relativePath) return;
  try {
    const filename = path.basename(relativePath);
    const p = path.join(__dirname, '..', 'uploads', filename);
    await fs.access(p);
    await fs.unlink(p);
    console.log('Deleted file:', p);
  } catch (err) {
    console.warn('removeFileIfExists warning (may not exist):', err.message);
  }
}

// GET all gallery items
router.get('/', async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('GET /api/gallery error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.json(item);
  } catch (err) {
    console.error('GET /api/gallery/:id error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST create new gallery item (auth + multiple images)
router.post('/', auth, upload.array('images', 20), async (req, res) => {
  console.log('Headers content-type:', req.headers['content-type']);
  console.log('req.body:', req.body, 'files:', (req.files || []).length);

  try {
    const { title, description, visible, order } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const newItem = new Gallery({
      title,
      description: description || '',
      images: imagePaths,
      coverImage: imagePaths.length > 0 ? imagePaths[0] : '',
      visible: visible === 'false' ? false : true,
      order: order ? Number(order) : 0,
    });

    await newItem.save();
    res.status(201).json({ message: 'Gallery item added', item: newItem });
  } catch (err) {
    console.error('POST /api/gallery error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update gallery item (auth + optional images)
router.put('/:id', auth, upload.array('images', 20), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, visible, order, replaceImages } = req.body;

    const item = await Gallery.findById(id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (visible !== undefined) item.visible = visible === 'true' || visible === true;
    if (order !== undefined) item.order = Number(order);

    // If new files uploaded
    const newPaths = (req.files || []).map((f) => `/uploads/${f.filename}`);
    if (newPaths.length > 0) {
      if (replaceImages === 'true' || replaceImages === true) {
        // remove old images
        if (item.images && item.images.length > 0) {
          await Promise.all(item.images.map((p) => removeFileIfExists(p)));
        }
        item.images = newPaths;
      } else {
        // append new images
        item.images = Array.isArray(item.images) ? item.images.concat(newPaths) : newPaths;
      }
      // ensure coverImage exists
      if (!item.coverImage && item.images.length > 0) item.coverImage = item.images[0];
    }

    await item.save();
    res.json({ message: 'Gallery item updated', item });
  } catch (err) {
    console.error('PUT /api/gallery/:id error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE gallery item (auth) — delete DB doc + files
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });

    const imagesToDelete = Array.isArray(item.images) ? [...item.images] : [];

    const deleted = await Gallery.findByIdAndDelete(id);
    console.log(`✅ Gallery deleted from DB: ${id} -> ${deleted ? 'OK' : 'NOT_FOUND'}`);

    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map((p) => removeFileIfExists(p)));
      console.log('🧹 Deleted associated image files (if existed).');
    } else {
      console.log('ℹ️ No associated images to delete.');
    }

    return res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    console.error('DELETE /api/gallery/:id error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
