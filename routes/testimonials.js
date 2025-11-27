const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  getActiveTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getAllTestimonials);
router.get('/active', getActiveTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes (admin only)
router.post('/', auth, createTestimonial);
router.put('/:id', auth, updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;
