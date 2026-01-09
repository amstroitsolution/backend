const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getAllServices,
  getActiveServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const protect = require('../middleware/auth');

const { uploadService } = require('../middleware/upload');

// Public routes
router.get('/', getAllServices);
router.get('/active', getActiveServices);

// Protected routes
router.post('/', protect, uploadService.single('image'), createService);
router.put('/:id', protect, uploadService.single('image'), updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
