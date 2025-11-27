const Stat = require('../models/Stat');

// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
exports.getAllStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// @desc    Get active stats
// @route   GET /api/stats/active
// @access  Public
exports.getActiveStats = async (req, res) => {
  try {
    const stats = await Stat.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// @desc    Get single stat
// @route   GET /api/stats/:id
// @access  Public
exports.getStatById = async (req, res) => {
  try {
    const stat = await Stat.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stat', error: error.message });
  }
};

// @desc    Create stat
// @route   POST /api/stats
// @access  Private/Admin
exports.createStat = async (req, res) => {
  try {
    const stat = await Stat.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    res.status(400).json({ message: 'Error creating stat', error: error.message });
  }
};

// @desc    Update stat
// @route   PUT /api/stats/:id
// @access  Private/Admin
exports.updateStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    res.status(200).json(stat);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stat', error: error.message });
  }
};

// @desc    Delete stat
// @route   DELETE /api/stats/:id
// @access  Private/Admin
exports.deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    res.status(200).json({ message: 'Stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stat', error: error.message });
  }
};
