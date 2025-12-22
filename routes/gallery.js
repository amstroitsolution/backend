// backend/routes/gallery.js
const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { uploadGallery } = require('../middleware/upload');
const auth = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');

// debug middleware
router.use((req, res, next) => {
  console.log('🔎 GALLERY ROUTER REQ:', req.method, req.originalUrl);
  next();
});

// Helper: delete from Cloudinary
async function deleteFromCloudinary(imageUrl) {
  if (!imageUrl) return;
  try {
    // Basic implementation: Log it for now. 
    // To properly delete, we need the public_id. With Cloudinary URL, we'd parse it.
    console.log('Skipping Cloudinary delete for now to ensure stability. Image:', imageUrl);
  } catch (err) {
    console.warn('deleteFromCloudinary warning:', err.message);
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
router.post('/', auth, uploadGallery.array('images', 20), async (req, res) => {
  try {
    const { title, description, visible, order } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    // FIX: Use Cloudinary path (URL)
    // req.files is populated by multer-storage-cloudinary
    const imagePaths = (req.files || []).map((f) => f.path);

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
router.put('/:id', auth, uploadGallery.array('images', 20), async (req, res) => {
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
    const newPaths = (req.files || []).map((f) => f.path);
    if (newPaths.length > 0) {
      if (replaceImages === 'true' || replaceImages === true) {
        // remove old images (noop for now to avoid crashes)
        // if (item.images && item.images.length > 0) {
        //   await Promise.all(item.images.map((p) => deleteFromCloudinary(p)));
        // }
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

// DELETE gallery item (auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });

    await Gallery.findByIdAndDelete(id);
    console.log(`✅ Gallery deleted from DB: ${id}`);

    // associated images deletion logic skipped to ensure stability
    // await Promise.all(item.images.map((p) => deleteFromCloudinary(p)));

    return res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    console.error('DELETE /api/gallery/:id error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
