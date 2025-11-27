const KidsHero = require('../models/KidsHero');

// @desc    Get all kids hero slides
// @route   GET /api/kids-hero
// @access  Public
exports.getAllKidsHero = async (req, res) => {
  try {
    const slides = await KidsHero.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kids hero slides', error: error.message });
  }
};

// @desc    Get active kids hero slides
// @route   GET /api/kids-hero/active
// @access  Public
exports.getActiveKidsHero = async (req, res) => {
  try {
    const slides = await KidsHero.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kids hero slides', error: error.message });
  }
};

// @desc    Get single kids hero slide
// @route   GET /api/kids-hero/:id
// @access  Public
exports.getKidsHeroById = async (req, res) => {
  try {
    const slide = await KidsHero.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Kids hero slide not found' });
    }
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching kids hero slide', error: error.message });
  }
};

// @desc    Create kids hero slide
// @route   POST /api/kids-hero
// @access  Private/Admin
exports.createKidsHero = async (req, res) => {
  try {
    // Handle file upload if present
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    
    const slide = await KidsHero.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ message: 'Error creating kids hero slide', error: error.message });
  }
};

// @desc    Update kids hero slide
// @route   PUT /api/kids-hero/:id
// @access  Private/Admin
exports.updateKidsHero = async (req, res) => {
  try {
    // Handle file upload if present
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    
    const slide = await KidsHero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!slide) {
      return res.status(404).json({ message: 'Kids hero slide not found' });
    }
    res.status(200).json(slide);
  } catch (error) {
    res.status(400).json({ message: 'Error updating kids hero slide', error: error.message });
  }
};

// @desc    Delete kids hero slide
// @route   DELETE /api/kids-hero/:id
// @access  Private/Admin
exports.deleteKidsHero = async (req, res) => {
  try {
    const slide = await KidsHero.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Kids hero slide not found' });
    }
    res.status(200).json({ message: 'Kids hero slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting kids hero slide', error: error.message });
  }
};
