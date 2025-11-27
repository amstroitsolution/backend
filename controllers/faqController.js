const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
};

// @desc    Get active FAQs
// @route   GET /api/faqs/active
// @access  Public
exports.getActiveFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
  }
};

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Public
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQ', error: error.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: 'Error creating FAQ', error: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ message: 'Error updating FAQ', error: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ', error: error.message });
  }
};
