const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

// @desc    Get active testimonials
// @route   GET /api/testimonials/active
// @access  Public
exports.getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonial', error: error.message });
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: 'Error creating testimonial', error: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: 'Error updating testimonial', error: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};
