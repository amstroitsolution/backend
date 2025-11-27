const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const heroController = require('../controllers/heroController');
const auth = require('../middleware/auth');

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads', 'hero');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|webm|ogg/;
    const extname = path.extname(file.originalname).toLowerCase();
    
    if (file.fieldname === 'backgroundImage') {
      if (allowedImageTypes.test(extname)) {
        return cb(null, true);
      }
    } else if (file.fieldname === 'backgroundVideo') {
      if (allowedVideoTypes.test(extname)) {
        return cb(null, true);
      }
    }
    cb(new Error('Invalid file type!'));
  }
});

// Validation middleware
const validateHero = [
  body('title').notEmpty().withMessage('Title is required'),
];

// Public routes
router.get('/', heroController.getAllHero);
router.get('/active', heroController.getActiveHero);
router.get('/:id', heroController.getHeroById);

// Protected routes (admin only)
router.post('/', auth, upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'backgroundVideo', maxCount: 1 }
]), validateHero, heroController.createHero);

router.put('/:id', auth, upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'backgroundVideo', maxCount: 1 }
]), validateHero, heroController.updateHero);

router.delete('/:id', auth, heroController.deleteHero);

module.exports = router;
