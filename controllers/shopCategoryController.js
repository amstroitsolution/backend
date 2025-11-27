const ShopCategory = require('../models/ShopCategory');
const fs = require('fs');
const path = require('path');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ShopCategory.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await ShopCategory.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (req.file) {
      categoryData.image = `/uploads/shop-categories/${req.file.filename}`;
    }
    const category = await ShopCategory.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await ShopCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    Object.keys(req.body).forEach(key => {
      category[key] = req.body[key];
    });
    if (req.file) {
      if (category.image) {
        const oldPath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      category.image = `/uploads/shop-categories/${req.file.filename}`;
    }
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await ShopCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
