const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getSettings,
  updateSettings
} = require('../controllers/ourValuesSettingsController');
const auth = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/our-values');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'section-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Public route
router.get('/', getSettings);

// Protected route (admin only) with file upload
router.put('/', auth, upload.single('sectionImage'), updateSettings);

module.exports = router;
