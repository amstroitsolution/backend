const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ourValuesController = require('../controllers/ourValuesController');

// Validation middleware
const validateOurValue = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
];

// Import auth middleware
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Our Values API is working!' });
});

// Seed route for testing
router.get('/seed', async (req, res) => {
  try {
    const OurValues = require('../models/OurValues');
    
    // Clear existing data
    await OurValues.deleteMany({});
    
    // Create sample data
    const sampleValues = [
      {
        title: 'Innovation',
        description: 'We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.',
        emoji: '💡',
        order: 1,
        isActive: true
      },
      {
        title: 'Quality',
        description: 'Excellence is not just a goal, it\'s our standard. We deliver only the highest quality products and services.',
        emoji: '⭐',
        order: 2,
        isActive: true
      },
      {
        title: 'Sustainability',
        description: 'We are committed to environmental responsibility and sustainable business practices.',
        emoji: '🌱',
        order: 3,
        isActive: true
      }
    ];
    
    const createdValues = await OurValues.insertMany(sampleValues);
    res.json({ 
      message: 'Our Values seeded successfully!', 
      count: createdValues.length,
      data: createdValues 
    });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

// Routes
router.get('/', ourValuesController.getAllOurValues);
router.get('/:id', ourValuesController.getOurValueById);
router.post('/', auth, validateOurValue, ourValuesController.createOurValue);
router.put('/:id', auth, validateOurValue, ourValuesController.updateOurValue);
router.delete('/:id', auth, ourValuesController.deleteOurValue);

module.exports = router;