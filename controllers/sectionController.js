const Section = require('../models/Section');
const SectionData = require('../models/SectionData');
const Inquiry = require('../models/Inquiry');

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

// Get all sections
exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1, createdAt: -1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sections', error: error.message });
  }
};

// Get active sections
exports.getActiveSections = async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true, showOnFrontend: true })
      .sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active sections', error: error.message });
  }
};

// Get section by ID
exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section', error: error.message });
  }
};

// Create section
exports.createSection = async (req, res) => {
  try {
    const section = new Section(req.body);
    await section.save();

    // Auto-create inquiry for new section/category
    await createAutoInquiry(
      section._id,
      'Section',
      `New Section: ${section.displayName}`,
      `Auto-generated inquiry for new section/category: "${section.displayName}". This section was created on ${new Date().toLocaleDateString()} and may need initial setup or product population. Section type: ${section.type || 'custom'}.`
    );

    res.status(201).json(section);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Section with this name already exists' });
    }
    res.status(500).json({ message: 'Error creating section', error: error.message });
  }
};

// Update section
exports.updateSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating section', error: error.message });
  }
};

// Delete section
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Delete all data associated with this section
    await SectionData.deleteMany({ sectionId: req.params.id });
    
    await Section.findByIdAndDelete(req.params.id);
    res.json({ message: 'Section and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting section', error: error.message });
  }
};

// Get section data
exports.getSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const data = await SectionData.find({ sectionId, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .populate('sectionId');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section data', error: error.message });
  }
};

// Create section data
exports.createSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    // Verify section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const sectionData = new SectionData({
      sectionId,
      data: req.body.data,
      isActive: req.body.isActive !== false,
      order: req.body.order || 0
    });

    await sectionData.save();

    // Auto-create inquiry for new section data/product
    const productTitle = req.body.data?.title || req.body.data?.name || 'New Product';
    const productPrice = req.body.data?.price || 'Not specified';
    
    await createAutoInquiry(
      sectionData._id,
      'SectionData',
      `New Product: ${productTitle}`,
      `Auto-generated inquiry for new product "${productTitle}" added to section "${section.displayName}". Product details: Price - ${productPrice}. Created on ${new Date().toLocaleDateString()}. This product may need review or additional setup.`
    );

    res.status(201).json(sectionData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating section data', error: error.message });
  }
};

// Update section data
exports.updateSectionData = async (req, res) => {
  try {
    const sectionData = await SectionData.findByIdAndUpdate(
      req.params.dataId,
      {
        data: req.body.data,
        isActive: req.body.isActive,
        order: req.body.order
      },
      { new: true, runValidators: true }
    );
    
    if (!sectionData) {
      return res.status(404).json({ message: 'Section data not found' });
    }
    
    res.json(sectionData);
  } catch (error) {
    res.status(500).json({ message: 'Error updating section data', error: error.message });
  }
};

// Delete section data
exports.deleteSectionData = async (req, res) => {
  try {
    const sectionData = await SectionData.findByIdAndDelete(req.params.dataId);
    
    if (!sectionData) {
      return res.status(404).json({ message: 'Section data not found' });
    }
    
    res.json({ message: 'Section data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting section data', error: error.message });
  }
};
