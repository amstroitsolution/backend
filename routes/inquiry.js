const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');

// Validation middleware
const inquiryValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('productType').isIn(['KidsProduct', 'WomenProduct', 'TrendingItem', 'NewArrival', 'BestSeller', 'FeaturedCollection', 'SpecialOffer']).withMessage('Invalid product type'),
  body('productUrl').optional().isLength({ min: 0 }).withMessage('Product URL is optional'),
  body('customerName').trim().isLength({ min: 2 }).withMessage('Customer name must be at least 2 characters'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').optional().isLength({ min: 0 }).withMessage('Valid phone number required'),
  body('message').trim().isLength({ min: 3 }).withMessage('Message must be at least 3 characters')
];

// Routes
router.post('/', inquiryValidation, inquiryController.createInquiry);
router.get('/', inquiryController.getAllInquiries);
router.get('/:id', inquiryController.getInquiryById);
router.put('/:id', inquiryController.updateInquiry);
router.post('/:id/reply', inquiryController.sendReplyToInquiry);
router.delete('/:id', inquiryController.deleteInquiry);

module.exports = router;