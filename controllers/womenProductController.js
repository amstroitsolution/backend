const WomenProduct = require('../models/WomenProduct');
const Inquiry = require('../models/Inquiry');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

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

// Get all women products
exports.getAllWomenProducts = async (req, res) => {
  try {
    const { category, categorySlug, featured, limit } = req.query;
    let query = {};
    
    // Use regex for category to match partial strings
    // e.g., "Wedding → Bridal Lehengas" will match
    if (category) {
      query.category = { $regex: category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }
    if (categorySlug) query.categorySlug = categorySlug;
    if (featured) query.featured = featured === 'true';
    
    let productsQuery = WomenProduct.find(query).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }
    
    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active women products
exports.getActiveWomenProducts = async (req, res) => {
  try {
    const { category, categorySlug, limit } = req.query;
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (categorySlug) query.categorySlug = categorySlug;
    
    let productsQuery = WomenProduct.find(query).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }
    
    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getWomenProductById = async (req, res) => {
  try {
    const product = await WomenProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create women product
exports.createWomenProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = { ...req.body };
    
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/women/${file.filename}`);
    }

    // Parse arrays if they come as strings
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }

    const product = new WomenProduct(productData);
    await product.save();

    // Auto-create inquiry for new women product
    await createAutoInquiry(
      product._id,
      'WomenProduct',
      `New Women Product: ${product.title}`,
      `Auto-generated inquiry for new women product "${product.title}". Category: ${product.category || 'Not specified'}, Price: ₹${product.price || 'Not specified'}. Created on ${new Date().toLocaleDateString()}. This product may need review or additional setup.`
    );
    
    res.status(201).json({ message: 'Women product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update women product
exports.updateWomenProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await WomenProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };
    
    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      // Delete old images
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          const imgPath = path.join(__dirname, '..', img);
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        });
      }
      updateData.images = req.files.map(file => `/uploads/women/${file.filename}`);
    }

    // Parse arrays if they come as strings
    if (typeof updateData.sizes === 'string') {
      updateData.sizes = JSON.parse(updateData.sizes);
    }
    if (typeof updateData.colors === 'string') {
      updateData.colors = JSON.parse(updateData.colors);
    }

    const updatedProduct = await WomenProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Women product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete women product
exports.deleteWomenProduct = async (req, res) => {
  try {
    const product = await WomenProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        const imgPath = path.join(__dirname, '..', img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await WomenProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Women product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
