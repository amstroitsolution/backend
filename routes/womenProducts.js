const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const womenProductController = require('../controllers/womenProductController');
const auth = require('../middleware/auth');

const { uploadWomen } = require('../middleware/upload');

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
router.post('/', auth, uploadWomen.array('images', 5), validateWomenProduct, womenProductController.createWomenProduct);
router.put('/:id', auth, uploadWomen.array('images', 5), validateWomenProduct, womenProductController.updateWomenProduct);
router.delete('/:id', auth, womenProductController.deleteWomenProduct);

module.exports = router;
