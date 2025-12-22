const express = require('express');
const router = express.Router();
const {
  getAllKidsHero,
  getActiveKidsHero,
  getKidsHeroById,
  createKidsHero,
  updateKidsHero,
  deleteKidsHero
} = require('../controllers/kidsHeroController');
const auth = require('../middleware/auth');
const { uploadKidsHero } = require('../middleware/upload');

// Public routes
router.get('/', getAllKidsHero);
router.get('/active', getActiveKidsHero);
router.get('/:id', getKidsHeroById);

// Protected routes (admin only)
router.post('/', auth, uploadKidsHero.single('image'), createKidsHero);
router.put('/:id', auth, uploadKidsHero.single('image'), updateKidsHero);
router.delete('/:id', auth, deleteKidsHero);

module.exports = router;
