const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const kidsProductController = require('../controllers/kidsProductController');
const auth = require('../middleware/auth');

const { uploadKids } = require('../middleware/upload');

// Validation middleware
const validateKidsProduct = [
  body('title').notEmpty().withMessage('Title is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

// Public routes
router.get('/', kidsProductController.getAllKidsProducts);
router.get('/active', kidsProductController.getActiveKidsProducts);
router.get('/:id', kidsProductController.getKidsProductById);

// Protected routes (admin only)
router.post('/', auth, uploadKids.array('images', 5), validateKidsProduct, kidsProductController.createKidsProduct);
router.put('/:id', auth, uploadKids.array('images', 5), validateKidsProduct, kidsProductController.updateKidsProduct);
router.delete('/:id', auth, kidsProductController.deleteKidsProduct);

module.exports = router;
