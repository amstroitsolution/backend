const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  sendReply
} = require('../controllers/contactController');

// Public routes
router.post('/', createContact);

// Admin routes (you can add authentication middleware here)
router.get('/', getAllContacts);
router.put('/:id/status', updateContactStatus);
router.post('/:id/reply', sendReply);
router.delete('/:id', deleteContact);

// Get saved emails (fallback when SMTP fails)
router.get('/saved-emails', async (req, res) => {
  try {
    const { getSavedEmails } = require('../services/fallbackEmailService');
    const emails = await getSavedEmails();
    res.json({
      success: true,
      data: emails,
      message: 'These emails were saved when SMTP failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved emails'
    });
  }
});

module.exports = router;