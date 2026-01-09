const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body } = require('express-validator');
const heroController = require('../controllers/heroController');
const auth = require('../middleware/auth');

const { uploadHero } = require('../middleware/upload');

// Validation middleware
const validateHero = [
  body('title').notEmpty().withMessage('Title is required'),
];

// Public routes
router.get('/', heroController.getAllHero);
router.get('/active', heroController.getActiveHero);
router.get('/:id', heroController.getHeroById);

// Protected routes (admin only)
router.post('/', auth, uploadHero.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'backgroundVideo', maxCount: 1 }
]), validateHero, heroController.createHero);

router.put('/:id', auth, uploadHero.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'backgroundVideo', maxCount: 1 }
]), validateHero, heroController.updateHero);

router.delete('/:id', auth, heroController.deleteHero);

module.exports = router;
