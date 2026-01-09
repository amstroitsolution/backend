const Hero = require('../models/Hero');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Get all hero slides
exports.getAllHero = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ order: 1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active hero slides
exports.getActiveHero = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort({ order: 1 });
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get hero by ID
exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create hero slide
exports.createHero = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const heroData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.backgroundImage && req.files.backgroundImage[0]) {
        heroData.backgroundImage = req.files.backgroundImage[0].path;
      }
      if (req.files.backgroundVideo && req.files.backgroundVideo[0]) {
        heroData.backgroundVideo = req.files.backgroundVideo[0].path;
      }
    }

    const hero = new Hero(heroData);
    await hero.save();
    res.status(201).json({ message: 'Hero slide created successfully', hero });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update hero slide
exports.updateHero = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    const updateData = { ...req.body };

    // Handle new file uploads
    if (req.files) {
      if (req.files.backgroundImage && req.files.backgroundImage[0]) {
        // Delete old image (local only)
        if (hero.backgroundImage && hero.backgroundImage.startsWith('/uploads/')) {
          const oldPath = path.join(process.cwd(), hero.backgroundImage);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) { console.error('Local delete failed:', e); }
          }
        }
        updateData.backgroundImage = req.files.backgroundImage[0].path;
      }

      if (req.files.backgroundVideo && req.files.backgroundVideo[0]) {
        // Delete old video (local only)
        if (hero.backgroundVideo && hero.backgroundVideo.startsWith('/uploads/')) {
          const oldPath = path.join(process.cwd(), hero.backgroundVideo);
          if (fs.existsSync(oldPath)) {
            try { fs.unlinkSync(oldPath); } catch (e) { console.error('Local delete failed:', e); }
          }
        }
        updateData.backgroundVideo = req.files.backgroundVideo[0].path;
      }
    }

    const updatedHero = await Hero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Hero slide updated successfully', hero: updatedHero });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete hero slide
exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    // Delete associated files (local only)
    if (hero.backgroundImage && hero.backgroundImage.startsWith('/uploads/')) {
      const imgPath = path.join(process.cwd(), hero.backgroundImage);
      if (fs.existsSync(imgPath)) {
        try { fs.unlinkSync(imgPath); } catch (e) { console.error('Local delete failed:', e); }
      }
    }
    if (hero.backgroundVideo && hero.backgroundVideo.startsWith('/uploads/')) {
      const videoPath = path.join(process.cwd(), hero.backgroundVideo);
      if (fs.existsSync(videoPath)) {
        try { fs.unlinkSync(videoPath); } catch (e) { console.error('Local delete failed:', e); }
      }
    }

    await Hero.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hero slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
