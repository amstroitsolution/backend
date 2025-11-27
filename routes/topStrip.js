const express = require('express');
const router = express.Router();
const { getTopStrip, updateTopStrip } = require('../controllers/topStripController');
const protect = require('../middleware/auth');

// Public route
router.get('/', getTopStrip);

// Protected route
router.post('/', protect, updateTopStrip);

module.exports = router;
