const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllKidsHero,
  getActiveKidsHero,
  getKidsHeroById,
  createKidsHero,
  updateKidsHero,
  deleteKidsHero
} = require('../controllers/kidsHeroController');
const auth = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `kids-hero-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Public routes
router.get('/', getAllKidsHero);
router.get('/active', getActiveKidsHero);
router.get('/:id', getKidsHeroById);

// Protected routes (admin only)
router.post('/', auth, upload.single('image'), createKidsHero);
router.put('/:id', auth, upload.single('image'), updateKidsHero);
router.delete('/:id', auth, deleteKidsHero);

module.exports = router;
