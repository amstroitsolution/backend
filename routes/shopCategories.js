const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getAllCategories,
  getActiveCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/shopCategoryController');
const protect = require('../middleware/auth');

const uploadDir = 'uploads/shop-categories';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const valid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
    cb(valid ? null : new Error('Only images allowed'), valid);
  }
});

router.get('/', getAllCategories);
router.get('/active', getActiveCategories);
router.post('/', protect, upload.single('image'), createCategory);
router.put('/:id', protect, upload.single('image'), updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
