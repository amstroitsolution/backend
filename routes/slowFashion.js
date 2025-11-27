const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const slowFashionController = require('../controllers/slowFashionController');

// Validation middleware
const validateSlowFashion = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image is required'),
];

// Import auth middleware
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Slow Fashion API is working!' });
});

// Seed route for testing
router.get('/seed', async (req, res) => {
  try {
    const SlowFashion = require('../models/SlowFashion');
    
    // Clear existing data
    await SlowFashion.deleteMany({});
    
    // Create sample data
    const sampleItems = [
      {
        title: 'Sustainable Cotton Collection',
        description: 'Discover our eco-friendly cotton pieces made from 100% organic materials. Perfect for conscious consumers.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        category: 'Sustainable Fashion',
        buttonText: 'Shop Now',
        buttonLink: '#',
        tags: ['organic', 'cotton', 'sustainable'],
        order: 1,
        isActive: true
      },
      {
        title: 'Vintage Revival Trends',
        description: 'Embrace timeless style with our curated vintage-inspired pieces that never go out of fashion.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
        category: 'Vintage',
        buttonText: 'Explore Collection',
        buttonLink: '#',
        tags: ['vintage', 'timeless', 'classic'],
        order: 2,
        isActive: true
      },
      {
        title: 'Ethical Manufacturing',
        description: 'Learn about our commitment to fair trade and ethical manufacturing processes.',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400',
        category: 'Ethics',
        buttonText: 'Learn More',
        buttonLink: '#',
        tags: ['ethical', 'fair-trade', 'manufacturing'],
        order: 3,
        isActive: true
      }
    ];
    
    const createdItems = await SlowFashion.insertMany(sampleItems);
    res.json({ 
      message: 'Slow Fashion seeded successfully!', 
      count: createdItems.length,
      data: createdItems 
    });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

// Routes
router.get('/', slowFashionController.getAllSlowFashion);
router.get('/:id', slowFashionController.getSlowFashionById);
router.post('/', auth, validateSlowFashion, slowFashionController.createSlowFashion);
router.put('/:id', auth, validateSlowFashion, slowFashionController.updateSlowFashion);
router.delete('/:id', auth, slowFashionController.deleteSlowFashion);

module.exports = router;