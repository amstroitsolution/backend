const KidsSection = require('../models/KidsSection');
const KidsSectionData = require('../models/KidsSectionData');

// Get all Kids sections
exports.getAllKidsSections = async (req, res) => {
  try {
    const sections = await KidsSection.find().sort({ order: 1, createdAt: -1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Kids sections', error: error.message });
  }
};

// Get active Kids sections
exports.getActiveKidsSections = async (req, res) => {
  try {
    const sections = await KidsSection.find({ isActive: true, showOnFrontend: true })
      .sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active Kids sections', error: error.message });
  }
};

// Get Kids section by ID
exports.getKidsSectionById = async (req, res) => {
  try {
    const section = await KidsSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Kids section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Kids section', error: error.message });
  }
};

// Create Kids section
exports.createKidsSection = async (req, res) => {
  try {
    const section = new KidsSection(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Kids section with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating Kids section', error: error.message });
  }
};

// Update Kids section
exports.updateKidsSection = async (req, res) => {
  try {
    const section = await KidsSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({ message: 'Kids section not found' });
    }
    
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Kids section', error: error.message });
  }
};

// Delete Kids section
exports.deleteKidsSection = async (req, res) => {
  try {
    const section = await KidsSection.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({ message: 'Kids section not found' });
    }

    // Delete all data associated with this Kids section
    await KidsSectionData.deleteMany({ sectionId: req.params.id });
    
    await KidsSection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kids section and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Kids section', error: error.message });
  }
};

// Get Kids section data
exports.getKidsSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const data = await KidsSectionData.find({ sectionId, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .populate('sectionId');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Kids section data', error: error.message });
  }
};

// Create Kids section data
exports.createKidsSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    // Verify Kids section exists
    const section = await KidsSection.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Kids section not found' });
    }

    const sectionData = new KidsSectionData({
      sectionId,
      data: req.body.data,
      isActive: req.body.isActive !== false,
      order: req.body.order || 0
    });

    await sectionData.save();
    res.status(201).json(sectionData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Kids section data', error: error.message });
  }
};

// Update Kids section data
exports.updateKidsSectionData = async (req, res) => {
  try {
    const sectionData = await KidsSectionData.findByIdAndUpdate(
      req.params.dataId,
      {
        data: req.body.data,
        isActive: req.body.isActive,
        order: req.body.order
      },
      { new: true, runValidators: true }
    );
    
    if (!sectionData) {
      return res.status(404).json({ message: 'Kids section data not found' });
    }
    
    res.json(sectionData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Kids section data', error: error.message });
  }
};

// Delete Kids section data
exports.deleteKidsSectionData = async (req, res) => {
  try {
    const sectionData = await KidsSectionData.findByIdAndDelete(req.params.dataId);
    
    if (!sectionData) {
      return res.status(404).json({ message: 'Kids section data not found' });
    }
    
    res.json({ message: 'Kids section data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Kids section data', error: error.message });
  }
};
