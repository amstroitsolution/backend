const SlowFashion = require('../models/SlowFashion');
const { validationResult } = require('express-validator');

// Get all slow fashion items
exports.getAllSlowFashion = async (req, res) => {
  try {
    console.log('👗 Fetching Slow Fashion items...');
    const items = await SlowFashion.find()
      .sort({ order: 1, createdAt: 1 });
    
    console.log(`👗 Found ${items.length} Slow Fashion items`);
    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching slow fashion items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single slow fashion item by ID
exports.getSlowFashionById = async (req, res) => {
  try {
    const item = await SlowFashion.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Slow fashion item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching slow fashion item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new slow fashion item
exports.createSlowFashion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, image, category, buttonText, buttonLink, tags, order, isActive } = req.body;

    const newItem = new SlowFashion({
      title,
      description,
      image,
      category,
      buttonText,
      buttonLink,
      tags: tags || [],
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating slow fashion item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update slow fashion item
exports.updateSlowFashion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, image, category, buttonText, buttonLink, tags, order, isActive } = req.body;

    const updatedItem = await SlowFashion.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        category,
        buttonText,
        buttonLink,
        tags,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Slow fashion item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating slow fashion item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete slow fashion item
exports.deleteSlowFashion = async (req, res) => {
  try {
    const deletedItem = await SlowFashion.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Slow fashion item not found' });
    }
    
    res.json({ message: 'Slow fashion item deleted successfully' });
  } catch (error) {
    console.error('Error deleting slow fashion item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};