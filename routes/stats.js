const express = require('express');
const router = express.Router();
const {
  getAllStats,
  getActiveStats,
  getStatById,
  createStat,
  updateStat,
  deleteStat
} = require('../controllers/statController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getAllStats);
router.get('/active', getActiveStats);
router.get('/:id', getStatById);

// Protected routes (admin only)
router.post('/', auth, createStat);
router.put('/:id', auth, updateStat);
router.delete('/:id', auth, deleteStat);

module.exports = router;
