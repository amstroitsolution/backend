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

const { uploadBestSeller } = require('../middleware/upload');

// Public routes
router.get('/', getAllBestSellers);
router.get('/active', getActiveBestSellers);

// Protected routes
router.post('/', protect, uploadBestSeller.array('images', 5), createBestSeller);
router.put('/:id', protect, uploadBestSeller.array('images', 5), updateBestSeller);
router.delete('/:id', protect, deleteBestSeller);

module.exports = router;
