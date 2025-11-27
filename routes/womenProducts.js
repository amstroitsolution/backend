const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const womenProductController = require('../controllers/womenProductController');
const auth = require('../middleware/auth');

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads', 'women');
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Validation middleware
const validateWomenProduct = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

// Public routes
router.get('/', womenProductController.getAllWomenProducts);
router.get('/active', womenProductController.getActiveWomenProducts);
router.get('/:id', womenProductController.getWomenProductById);

// Protected routes (admin only)
router.post('/', auth, upload.array('images', 5), validateWomenProduct, womenProductController.createWomenProduct);
router.put('/:id', auth, upload.array('images', 5), validateWomenProduct, womenProductController.updateWomenProduct);
router.delete('/:id', auth, womenProductController.deleteWomenProduct);

module.exports = router;
