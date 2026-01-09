const KidsProduct = require('../models/KidsProduct');
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

// Get all kids products
exports.getAllKidsProducts = async (req, res) => {
  try {
    const { category, gender, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (featured) query.featured = featured === 'true';

    const products = await KidsProduct.find(query).sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active kids products
exports.getActiveKidsProducts = async (req, res) => {
  try {
    const { category, gender } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (gender) query.gender = gender;

    const products = await KidsProduct.find(query).sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getKidsProductById = async (req, res) => {
  try {
    const product = await KidsProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create kids product
exports.createKidsProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = { ...req.body };

    // Handle file uploads (Cloudinary returns file.path as the URL)
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path || file.url);
    }

    // Parse arrays if they come as strings
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }

    const product = new KidsProduct(productData);
    await product.save();

    // Auto-create inquiry for new kids product
    await createAutoInquiry(
      product._id,
      'KidsProduct',
      `New Kids Product: ${product.title}`,
      `Auto-generated inquiry for new kids product "${product.title}". Category: ${product.category || 'Not specified'}, Gender: ${product.gender || 'Not specified'}, Price: ₹${product.price || 'Not specified'}. Created on ${new Date().toLocaleDateString()}. This product may need review or additional setup.`
    );

    res.status(201).json({ message: 'Kids product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update kids product
exports.updateKidsProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await KidsProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      // Delete old images (local only)
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          if (img.startsWith('/uploads/')) {
            const imgPath = path.join(process.cwd(), img);
            if (fs.existsSync(imgPath)) {
              try { fs.unlinkSync(imgPath); } catch (e) { console.error('Local delete failed:', e); }
            }
          }
        });
      }
      updateData.images = req.files.map(file => file.path || file.url);
    }

    // Parse arrays if they come as strings
    if (typeof updateData.sizes === 'string') {
      updateData.sizes = JSON.parse(updateData.sizes);
    }
    if (typeof updateData.colors === 'string') {
      updateData.colors = JSON.parse(updateData.colors);
    }

    const updatedProduct = await KidsProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Kids product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete kids product
exports.deleteKidsProduct = async (req, res) => {
  try {
    const product = await KidsProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img.startsWith('/uploads/')) {
          const imgPath = path.join(process.cwd(), img);
          if (fs.existsSync(imgPath)) {
            try { fs.unlinkSync(imgPath); } catch (e) { console.error('Local delete failed:', e); }
          }
        }
      });
    }

    await KidsProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kids product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
