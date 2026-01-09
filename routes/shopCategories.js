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

const { uploadShopCategory } = require('../middleware/upload');

router.get('/', getAllCategories);
router.get('/active', getActiveCategories);
router.post('/', protect, uploadShopCategory.single('image'), createCategory);
router.put('/:id', protect, uploadShopCategory.single('image'), updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
