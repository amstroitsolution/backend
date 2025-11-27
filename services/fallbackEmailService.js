// Fallback email service - saves emails to database instead of sending
const Contact = require('../models/Contact');

// Create a simple email log model
const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  to: String,
  from: String,
  subject: String,
  html: String,
  type: {
    type: String,
    enum: ['admin_notification', 'customer_confirmation', 'admin_reply']
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// Fallback functions that save emails to database
const saveEmailToDatabase = async (emailData) => {
  try {
    const emailLog = new EmailLog(emailData);
    await emailLog.save();
    console.log(`Email saved to database: ${emailData.type}`);
    return true;
  } catch (error) {
    console.error('Error saving email to database:', error);
    return false;
  }
};

const fallbackAdminNotification = async (contactData) => {
  const emailData = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.EMAIL_USER,
    subject: `New Contact Message from ${contactData.name}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone}</p>
      <p><strong>Subject:</strong> ${contactData.subject}</p>
      <p><strong>Message:</strong> ${contactData.message}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `,
    type: 'admin_notification',
    contactId: contactData._id
  };
  
  return await saveEmailToDatabase(emailData);
};

const fallbackCustomerConfirmation = async (contactData) => {
  const emailData = {
    to: contactData.email,
    from: process.env.EMAIL_USER,
    subject: 'Thank you for contacting us - We received your message!',
    html: `
      <h2>Thank You for Contacting Us!</h2>
      <p>Hello ${contactData.name},</p>
      <p>We have received your message and will get back to you soon.</p>
      <p><strong>Your Message:</strong> ${contactData.message}</p>
      <p>Best regards,<br>Yashiper Team</p>
    `,
    type: 'customer_confirmation',
    contactId: contactData._id
  };
  
  return await saveEmailToDatabase(emailData);
};

const fallbackReplyToCustomer = async (contactData, replyMessage, adminName) => {
  const emailData = {
    to: contactData.email,
    from: process.env.EMAIL_USER,
    subject: `Re: ${contactData.subject}`,
    html: `
      <h2>Response to Your Inquiry</h2>
      <p>Hello ${contactData.name},</p>
      <p>Thank you for your inquiry. Here is our response:</p>
      <div style="background: #f5f5f5; padding: 15px; margin: 15px 0;">
        ${replyMessage.replace(/\n/g, '<br>')}
      </div>
      <p>Your original message: "${contactData.message}"</p>
      <p>Best regards,<br>${adminName || 'Yashiper Team'}</p>
    `,
    type: 'admin_reply',
    contactId: contactData._id
  };
  
  return await saveEmailToDatabase(emailData);
};

// Function to get all saved emails (for admin to see what emails would have been sent)
const getSavedEmails = async () => {
  try {
    const emails = await EmailLog.find().sort({ createdAt: -1 }).populate('contactId');
    return emails;
  } catch (error) {
    console.error('Error fetching saved emails:', error);
    return [];
  }
};

module.exports = {
  fallbackAdminNotification,
  fallbackCustomerConfirmation,
  fallbackReplyToCustomer,
  getSavedEmails,
  EmailLog
};