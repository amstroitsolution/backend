const BestSeller = require('../models/BestSeller');
const fs = require('fs');
const path = require('path');

// Get all bestsellers
exports.getAllBestSellers = async (req, res) => {
  try {
    const bestsellers = await BestSeller.find().sort({ order: 1 });
    res.json(bestsellers);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active bestsellers only
exports.getActiveBestSellers = async (req, res) => {
  try {
    const bestsellers = await BestSeller.find({ isActive: true }).sort({ order: 1 });
    res.json(bestsellers);
  } catch (error) {
    console.error('Error fetching active bestsellers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create bestseller
exports.createBestSeller = async (req, res) => {
  try {
    const { title, description, price, originalPrice, rating, reviews, badge, discount, category, order, isActive } = req.body;
    
    const bestsellerData = {
      title,
      description,
      price,
      originalPrice,
      rating: rating || 0,
      reviews: reviews || 0,
      badge: badge || 'BESTSELLER',
      discount,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    };

    if (req.files && req.files.length > 0) {
      bestsellerData.images = req.files.map(file => `/uploads/bestsellers/${file.filename}`);
    }

    const bestseller = await BestSeller.create(bestsellerData);
    res.status(201).json(bestseller);
  } catch (error) {
    console.error('Error creating bestseller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update bestseller
exports.updateBestSeller = async (req, res) => {
  try {
    const bestseller = await BestSeller.findById(req.params.id);

    if (!bestseller) {
      return res.status(404).json({ message: 'Bestseller not found' });
    }

    const { title, description, price, originalPrice, rating, reviews, badge, discount, category, order, isActive } = req.body;

    bestseller.title = title || bestseller.title;
    bestseller.description = description || bestseller.description;
    bestseller.price = price !== undefined ? price : bestseller.price;
    bestseller.originalPrice = originalPrice !== undefined ? originalPrice : bestseller.originalPrice;
    bestseller.rating = rating !== undefined ? rating : bestseller.rating;
    bestseller.reviews = reviews !== undefined ? reviews : bestseller.reviews;
    bestseller.badge = badge || bestseller.badge;
    bestseller.discount = discount || bestseller.discount;
    bestseller.category = category || bestseller.category;
    bestseller.order = order !== undefined ? order : bestseller.order;
    bestseller.isActive = isActive !== undefined ? isActive : bestseller.isActive;

    if (req.files && req.files.length > 0) {
      // Delete old images
      if (bestseller.images && bestseller.images.length > 0) {
        bestseller.images.forEach(img => {
          const imagePath = path.join(__dirname, '..', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      bestseller.images = req.files.map(file => `/uploads/bestsellers/${file.filename}`);
    }

    await bestseller.save();
    res.json(bestseller);
  } catch (error) {
    console.error('Error updating bestseller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete bestseller
exports.deleteBestSeller = async (req, res) => {
  try {
    const bestseller = await BestSeller.findById(req.params.id);

    if (!bestseller) {
      return res.status(404).json({ message: 'Bestseller not found' });
    }

    // Delete images
    if (bestseller.images && bestseller.images.length > 0) {
      bestseller.images.forEach(img => {
        const imagePath = path.join(__dirname, '..', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await bestseller.deleteOne();
    res.json({ message: 'Bestseller deleted successfully' });
  } catch (error) {
    console.error('Error deleting bestseller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
