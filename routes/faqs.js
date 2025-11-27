const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  getActiveFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getAllFAQs);
router.get('/active', getActiveFAQs);
router.get('/:id', getFAQById);

// Protected routes (admin only)
router.post('/', auth, createFAQ);
router.put('/:id', auth, updateFAQ);
router.delete('/:id', auth, deleteFAQ);

module.exports = router;
