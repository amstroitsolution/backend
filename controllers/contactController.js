const Contact = require('../models/Contact');
const { sendContactNotificationToAdmin, sendContactConfirmationToCustomer, sendReplyToCustomer } = require('../services/emailService');

// Create new contact message
const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    // Send emails (don't wait for them to complete to avoid delays)
    Promise.all([
      sendContactNotificationToAdmin(contact),
      sendContactConfirmationToCustomer(contact)
    ]).catch(error => {
      console.error('Email sending failed:', error);
      // Don't fail the request if email fails
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: contact
    });

  } catch (error) {
    console.error('Contact creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

// Get all contacts (for admin)
const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContacts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// Update contact status
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};

// Delete contact
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};

// Send reply to contact
const sendReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, adminName } = req.body;

    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Send reply email
    const emailSent = await sendReplyToCustomer(contact, replyMessage.trim(), adminName || 'Yashiper Team');

    if (emailSent) {
      // Update contact status to replied
      contact.status = 'replied';
      await contact.save();

      res.status(200).json({
        success: true,
        message: 'Reply sent successfully',
        data: contact
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send reply email'
      });
    }

  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply'
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  sendReply
};