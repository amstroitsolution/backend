const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { uploadGeneral } = require('../middleware/upload');
const auth = require('../middleware/auth');

// GET all active equipment
router.get('/', async (req, res) => {
  try {
    const items = await Equipment.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Equipment fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create new equipment (admin)
router.post('/', auth, uploadGeneral.single('image'), async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.file) {
      itemData.images = [req.file.path];
    }
    const newItem = new Equipment(itemData);
    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error: error.message });
  }
});

// PUT update equipment (admin)
router.put('/:id', auth, uploadGeneral.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.images = [req.file.path];
    }
    const updated = await Equipment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating item', error: error.message });
  }
});

// DELETE equipment (admin)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

module.exports = router;
