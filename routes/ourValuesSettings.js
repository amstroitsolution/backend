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

const { uploadOurValues } = require('../middleware/upload');

// Public route
router.get('/', getSettings);

// Protected route (admin only) with file upload
router.put('/', auth, uploadOurValues.single('sectionImage'), updateSettings);

module.exports = router;
