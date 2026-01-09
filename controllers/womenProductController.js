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

    // Use regex for category to match partial strings (same as getAllWomenProducts)
    if (category) {
      query.category = { $regex: category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    }
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

    // Handle file uploads (Cloudinary returns file.path as the URL)
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.path || file.url);
    }

    // Parse arrays if they come as strings
    if (typeof productData.sizes === 'string') {
      try { productData.sizes = JSON.parse(productData.sizes); } catch (e) { productData.sizes = productData.sizes.split(',').filter(Boolean); }
    }
    if (typeof productData.colors === 'string') {
      try { productData.colors = JSON.parse(productData.colors); } catch (e) { productData.colors = productData.colors.split(',').filter(Boolean); }
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

    // Handle existing images
    let currentImages = [];
    if (req.body.existingImages) {
      currentImages = JSON.parse(req.body.existingImages);
    }

    // Identify images to delete
    if (product.images && product.images.length > 0) {
      const removedImages = product.images.filter(img => !currentImages.includes(img));
      removedImages.forEach(img => {
        // Only attempt to delete if it's a local path
        if (img.startsWith('/uploads/')) {
          const imgPath = path.join(process.cwd(), img);
          if (fs.existsSync(imgPath)) {
            try { fs.unlinkSync(imgPath); } catch (e) { console.error('Local delete failed:', e); }
          }
        }
        // Cloudinary deletion could be added here if needed
      });
    }

    // Handle new file uploads (Cloudinary returns file.path as the URL)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path || file.url);
      currentImages = [...currentImages, ...newImages];
    }

    updateData.images = currentImages;

    // Parse arrays if they come as strings
    if (typeof updateData.sizes === 'string') {
      try { updateData.sizes = JSON.parse(updateData.sizes); } catch (e) { updateData.sizes = updateData.sizes.split(',').filter(Boolean); }
    }
    if (typeof updateData.colors === 'string') {
      try { updateData.colors = JSON.parse(updateData.colors); } catch (e) { updateData.colors = updateData.colors.split(',').filter(Boolean); }
    }

    // Remove existingImages from updateData so it doesn't get saved as a field
    delete updateData.existingImages;

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
        if (img.startsWith('/uploads/')) {
          const imgPath = path.join(process.cwd(), img);
          if (fs.existsSync(imgPath)) {
            try { fs.unlinkSync(imgPath); } catch (e) { console.error('Local delete failed:', e); }
          }
        }
      });
    }

    await WomenProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Women product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
