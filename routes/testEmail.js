const express = require('express');
const router = express.Router();
const { sendContactNotificationToAdmin, sendContactConfirmationToCustomer } = require('../services/emailService');

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    console.log('Testing email service...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

    const testContactData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'Test Email',
      message: 'This is a test message to check email functionality.'
    };

    // Test admin notification
    console.log('Sending admin notification...');
    const adminResult = await sendContactNotificationToAdmin(testContactData);
    console.log('Admin notification result:', adminResult);

    // Test customer confirmation
    console.log('Sending customer confirmation...');
    const customerResult = await sendContactConfirmationToCustomer(testContactData);
    console.log('Customer confirmation result:', customerResult);

    res.json({
      success: true,
      message: 'Email test completed',
      results: {
        adminNotification: adminResult,
        customerConfirmation: customerResult
      }
    });

  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

module.exports = router;