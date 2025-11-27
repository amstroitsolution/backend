const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getAllBestSellers,
  getActiveBestSellers,
  createBestSeller,
  updateBestSeller,
  deleteBestSeller
} = require('../controllers/bestSellerController');
const protect = require('../middleware/auth');

// Create uploads directory
const uploadDir = 'uploads/bestsellers';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bestseller-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Public routes
router.get('/', getAllBestSellers);
router.get('/active', getActiveBestSellers);

// Protected routes
router.post('/', protect, upload.array('images', 5), createBestSeller);
router.put('/:id', protect, upload.array('images', 5), updateBestSeller);
router.delete('/:id', protect, deleteBestSeller);

module.exports = router;
