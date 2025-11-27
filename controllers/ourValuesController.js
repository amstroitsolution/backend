const OurValues = require('../models/OurValues');
const { validationResult } = require('express-validator');

// Get all our values
exports.getAllOurValues = async (req, res) => {
  try {
    console.log('📊 Fetching Our Values...');
    const values = await OurValues.find()
      .sort({ order: 1, createdAt: 1 });
    
    console.log(`📊 Found ${values.length} Our Values`);
    res.json(values);
  } catch (error) {
    console.error('❌ Error fetching our values:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single our value by ID
exports.getOurValueById = async (req, res) => {
  try {
    const value = await OurValues.findById(req.params.id);
    
    if (!value) {
      return res.status(404).json({ message: 'Our value not found' });
    }
    
    res.json(value);
  } catch (error) {
    console.error('Error fetching our value:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new our value
exports.createOurValue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, icon, emoji, order, isActive } = req.body;

    const newValue = new OurValues({
      title,
      description,
      icon,
      emoji,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedValue = await newValue.save();
    res.status(201).json(savedValue);
  } catch (error) {
    console.error('Error creating our value:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update our value
exports.updateOurValue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, icon, emoji, order, isActive } = req.body;

    const updatedValue = await OurValues.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        icon,
        emoji,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedValue) {
      return res.status(404).json({ message: 'Our value not found' });
    }

    res.json(updatedValue);
  } catch (error) {
    console.error('Error updating our value:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete our value
exports.deleteOurValue = async (req, res) => {
  try {
    const deletedValue = await OurValues.findByIdAndDelete(req.params.id);
    
    if (!deletedValue) {
      return res.status(404).json({ message: 'Our value not found' });
    }
    
    res.json({ message: 'Our value deleted successfully' });
  } catch (error) {
    console.error('Error deleting our value:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};