const Inquiry = require('../models/Inquiry');
const KidsProduct = require('../models/KidsProduct');
const TrendingItem = require('../models/TrendingItem');
const NewArrival = require('../models/NewArrival');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const {
  fallbackAdminNotification,
  fallbackCustomerConfirmation,
  fallbackReplyToCustomer
} = require('../services/fallbackEmailService');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Get product details by type and ID
const getProductDetails = async (productType, productId) => {
  let product;

  // For hardcoded products (like from GownDressesSection), create a mock product
  if (typeof productId === 'string' && (productId.startsWith('gown') || productId.startsWith('best'))) {
    return {
      _id: productId,
      title: 'Product',
      name: 'Product',
      price: 0,
      images: []
    };
  }

  try {
    switch (productType) {
      case 'KidsProduct':
        product = await KidsProduct.findById(productId);
        break;
      case 'TrendingItem':
        product = await TrendingItem.findById(productId);
        break;
      case 'NewArrival':
        product = await NewArrival.findById(productId);
        break;
      case 'WomenProduct':
      case 'BestSeller':
      case 'FeaturedCollection':
      case 'SpecialOffer':
        // For these types, return a generic product object
        return {
          _id: productId,
          title: 'Product',
          name: 'Product',
          price: 0,
          images: []
        };
      case 'Section':
        // For section inquiries, try to get section details
        try {
          const Section = require('../models/Section');
          const section = await Section.findById(productId);
          return {
            _id: productId,
            title: section?.displayName || 'Section',
            name: section?.displayName || 'Section',
            price: 0,
            images: [],
            category: 'Section/Category'
          };
        } catch (err) {
          return {
            _id: productId,
            title: 'Section',
            name: 'Section',
            price: 0,
            images: [],
            category: 'Section/Category'
          };
        }
      case 'SectionData':
        // For section data inquiries, try to get section data details
        try {
          const SectionData = require('../models/SectionData');
          const sectionData = await SectionData.findById(productId).populate('sectionId');
          return {
            _id: productId,
            title: sectionData?.data?.title || sectionData?.data?.name || 'Product',
            name: sectionData?.data?.title || sectionData?.data?.name || 'Product',
            price: sectionData?.data?.price || 0,
            images: sectionData?.data?.images || [],
            category: sectionData?.sectionId?.displayName || 'Product'
          };
        } catch (err) {
          return {
            _id: productId,
            title: 'Product',
            name: 'Product',
            price: 0,
            images: [],
            category: 'Product'
          };
        }
      default:
        return {
          _id: productId,
          title: 'Product',
          name: 'Product',
          price: 0,
          images: []
        };
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      _id: productId,
      title: 'Product',
      name: 'Product',
      price: 0,
      images: []
    };
  }

  return product || {
    _id: productId,
    title: 'Product',
    name: 'Product',
    price: 0,
    images: []
  };
};

// Send reply email to customer for inquiry
const sendInquiryReplyEmail = async (inquiry, product, replyMessage, adminName = 'Yashiper Team') => {
  try {
    const transporter = createTransporter();

    // Test the connection first
    await transporter.verify();
    console.log('SMTP connection verified for inquiry reply email');

    const productTitle = product?.title || product?.name || 'Product';
    const productPrice = product?.price || 0;
    const productImage = product?.image || (product?.images && product?.images[0]) || null;

    // Determine image URL
    let imageUrl = '';
    if (productImage) {
      if (productImage.startsWith('http')) {
        imageUrl = productImage;
      } else {
        imageUrl = `${process.env.BASE_URL || 'http://localhost:5000/'}${productImage}`;
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: inquiry.customerEmail,
      subject: `Re: Your Product Inquiry - ${productTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Response to Your Product Inquiry</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Thank you for your interest in our products</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9fa;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hello ${inquiry.customerName}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your inquiry about "<strong>${productTitle}</strong>". 
                We have reviewed your message and here is our response:
              </p>
              
              <!-- Product Info -->
              ${imageUrl ? `
                <div style="display: flex; align-items: center; gap: 15px; background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <img src="${imageUrl}" alt="${productTitle}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
                  <div>
                    <h4 style="margin: 0 0 5px 0; color: #e91e63;">${productTitle}</h4>
                    ${productPrice > 0 ? `<p style="margin: 0; color: #666; font-weight: bold;">₹${productPrice.toLocaleString()}</p>` : ''}
                  </div>
                </div>
              ` : ''}
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #e91e63; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Our Response:</h3>
                <div style="background: white; padding: 15px; border-radius: 4px; color: #333; line-height: 1.6;">
                  ${replyMessage.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2d5a2d; margin-top: 0; margin-bottom: 10px;">📞 Need Further Assistance?</h3>
                <p style="color: #2d5a2d; margin: 0; line-height: 1.6;">
                  If you have any additional questions, feel free to reply to this email or call us at 
                  <strong>+91 98765 43210</strong> during business hours.
                </p>
              </div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>Your Original Message:</strong><br>
                  "${inquiry.message}"
                </p>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <p style="color: #666; margin-bottom: 15px;">Follow us for latest updates:</p>
                <div style="display: inline-block;">
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #e91e63; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Facebook</a>
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #e91e63; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Instagram</a>
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #e91e63; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Best Regards,<br>${adminName}</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              Yashiper Fashion | FF 06, Global Foyer Mall, Sector 1, Pocket H, Palam Vihar, Gurugram, Haryana - 122017<br>
              Email: yashper9@gmail.com | Phone: +91 98765 43210
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Inquiry reply sent to customer successfully');
    return true;
  } catch (error) {
    console.error('Error sending inquiry reply to customer:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });

    // Use fallback service
    console.log('Using fallback email service for inquiry reply...');
    return await fallbackReplyToCustomer(inquiry, replyMessage, adminName);
  }
};

// Send inquiry emails
const sendInquiryEmails = async (inquiry, product, productData = null) => {
  const transporter = createTransporter();

  // Use productData from frontend if available, otherwise use database product
  const displayProduct = productData || product;
  const productTitle = displayProduct.title || displayProduct.name || 'Product';
  const productPrice = displayProduct.price || 0;
  const productImage = displayProduct.image || (displayProduct.images && displayProduct.images[0]) || null;
  const productDescription = displayProduct.description || '';
  const productCategory = displayProduct.category || '';

  // Determine image URL
  let imageUrl = '';
  if (productImage) {
    if (productImage.startsWith('http')) {
      imageUrl = productImage; // External URL
    } else {
      imageUrl = `${process.env.BASE_URL || 'http://localhost:5000/'}${productImage}`; // Local image
    }
  }

  // Email to customer
  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: inquiry.customerEmail,
    subject: `Product Inquiry Confirmation - ${productTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #e91e63, #9c27b0); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Thank You for Your Inquiry!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">We've received your product inquiry</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #333; margin-bottom: 25px;">Dear <strong>${inquiry.customerName}</strong>,</p>
          <p style="font-size: 16px; color: #666; margin-bottom: 30px;">We have received your inquiry about the following product and will get back to you within 24 hours:</p>
          
          <!-- Product Card -->
          <div style="border: 2px solid #e91e63; border-radius: 12px; padding: 20px; margin: 25px 0; background: linear-gradient(135deg, #fce4ec, #f3e5f5);">
            <div style="display: flex; align-items: center; gap: 20px;">
              ${imageUrl ? `
                <div style="flex-shrink: 0;">
                  <img src="${imageUrl}" alt="${productTitle}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 2px solid #e91e63; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                </div>
              ` : ''}
              <div style="flex: 1;">
                <h3 style="color: #e91e63; margin: 0 0 10px 0; font-size: 22px; font-weight: bold;">${productTitle}</h3>
                ${productCategory ? `<p style="color: #9c27b0; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">${productCategory}</p>` : ''}
                ${productDescription ? `<p style="color: #666; margin: 0 0 12px 0; font-size: 14px; line-height: 1.4;">${productDescription}</p>` : ''}
                ${productPrice > 0 ? `<p style="color: #e91e63; margin: 0; font-size: 20px; font-weight: bold;">₹${productPrice.toLocaleString()}</p>` : ''}
                ${inquiry.productUrl ? `<p style="margin: 10px 0 0 0;"><a href="${inquiry.productUrl}" style="color: #9c27b0; text-decoration: none; font-size: 14px;">View Product Page →</a></p>` : ''}
              </div>
            </div>
          </div>
          
          <!-- Customer Message -->
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #e91e63;">
            <h4 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Your Message:</h4>
            <p style="color: #666; margin: 0; font-style: italic; font-size: 15px; line-height: 1.5;">"${inquiry.message}"</p>
          </div>
          
          <!-- Contact Info -->
          <div style="background: linear-gradient(135deg, #e3f2fd, #f3e5f5); padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Your Contact Information:</h4>
            <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${inquiry.customerEmail}</p>
            ${inquiry.customerPhone ? `<p style="margin: 5px 0; color: #666;"><strong>Phone:</strong> ${inquiry.customerPhone}</p>` : ''}
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0 0 10px 0;">Our team will review your inquiry and respond within 24 hours.</p>
            <p style="color: #666; margin: 0 0 20px 0;">For urgent questions, please contact us directly.</p>
            <p style="color: #333; margin: 0; font-weight: bold;">Best regards,<br>Your Fashion Store Team</p>
          </div>
        </div>
      </div>
    `
  };

  // Email to admin/owner
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🔔 New Product Inquiry - ${productTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc3545, #fd7e14); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 26px; font-weight: bold;">🔔 New Product Inquiry</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Action Required - Customer Inquiry Received</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 25px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Customer Details -->
          <div style="background: linear-gradient(135deg, #e3f2fd, #f1f8e9); border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1976d2; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              👤 Customer Information
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Name</p>
                <p style="margin: 0; color: #333; font-weight: bold; font-size: 16px;">${inquiry.customerName}</p>
              </div>
              <div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Email</p>
                <p style="margin: 0; color: #1976d2; font-weight: bold; font-size: 16px;">
                  <a href="mailto:${inquiry.customerEmail}" style="color: #1976d2; text-decoration: none;">${inquiry.customerEmail}</a>
                </p>
              </div>
              ${inquiry.customerPhone ? `
                <div>
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Phone</p>
                  <p style="margin: 0; color: #333; font-weight: bold; font-size: 16px;">
                    <a href="tel:${inquiry.customerPhone}" style="color: #333; text-decoration: none;">${inquiry.customerPhone}</a>
                  </p>
                </div>
              ` : ''}
              <div>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Inquiry Time</p>
                <p style="margin: 0; color: #333; font-weight: bold; font-size: 16px;">${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <!-- Product Details -->
          <div style="background: linear-gradient(135deg, #fce4ec, #f3e5f5); border: 1px solid #e91e63; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #e91e63; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              🛍️ Product Details
            </h3>
            <div style="display: flex; align-items: center; gap: 20px;">
              ${imageUrl ? `
                <div style="flex-shrink: 0;">
                  <img src="${imageUrl}" alt="${productTitle}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #e91e63; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                </div>
              ` : ''}
              <div style="flex: 1;">
                <h4 style="color: #e91e63; margin: 0 0 8px 0; font-size: 20px; font-weight: bold;">${productTitle}</h4>
                ${productCategory ? `<p style="color: #9c27b0; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${productCategory}</p>` : ''}
                ${productDescription ? `<p style="color: #666; margin: 0 0 8px 0; font-size: 14px;">${productDescription}</p>` : ''}
                ${productPrice > 0 ? `<p style="color: #e91e63; margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">₹${productPrice.toLocaleString()}</p>` : ''}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 13px;">
                  <div><strong>Product ID:</strong> ${inquiry.productId}</div>
                  <div><strong>Type:</strong> ${inquiry.productType}</div>
                </div>
                ${inquiry.productUrl ? `<p style="margin: 10px 0 0 0;"><a href="${inquiry.productUrl}" style="color: #9c27b0; text-decoration: none; font-size: 14px;">View Product Page →</a></p>` : ''}
              </div>
            </div>
          </div>
          
          <!-- Customer Message -->
          <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
              💬 Customer Message
            </h3>
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
              <p style="color: #333; margin: 0; font-size: 15px; line-height: 1.6; font-style: italic;">"${inquiry.message}"</p>
            </div>
          </div>
          
          <!-- Action Required -->
          <div style="background: linear-gradient(135deg, #d4edda, #f8d7da); border: 1px solid #28a745; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #155724; margin: 0 0 10px 0; font-size: 18px;">⚡ Action Required</h3>
            <p style="color: #155724; margin: 0 0 15px 0; font-size: 14px;">Please respond to this customer inquiry as soon as possible.</p>
            <p style="margin: 0; font-size: 13px; color: #666;">
              <strong>Inquiry ID:</strong> ${inquiry._id || 'N/A'}<br>
              <strong>Priority:</strong> High - Respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(customerMailOptions);
    await transporter.sendMail(adminMailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Create new inquiry
exports.createInquiry = async (req, res) => {
  try {
    console.log('Inquiry request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, productType, productUrl, customerName, customerEmail, customerPhone, message, productData } = req.body;

    // Verify product exists (for database products) or use provided product data
    const product = await getProductDetails(productType, productId);
    if (!product && !productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create inquiry
    const inquiry = new Inquiry({
      productId,
      productType,
      productUrl,
      customerName,
      customerEmail,
      customerPhone,
      message
    });

    await inquiry.save();

    // Send emails with product data from frontend if available
    const emailSent = await sendInquiryEmails(inquiry, product, productData);

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry,
      emailSent
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all inquiries (admin)
exports.getAllInquiries = async (req, res) => {
  try {
    const { status, productType } = req.query;
    let query = {};

    if (status) query.status = status;
    if (productType) query.productType = productType;

    const inquiries = await Inquiry.find(query)
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get inquiry by ID
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('productId');
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update inquiry status and add admin response
exports.updateInquiry = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.respondedAt = new Date();
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('productId');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry updated successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send reply to inquiry
exports.sendReplyToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, adminName } = req.body;

    console.log('Received reply request for inquiry:', id);
    console.log('Reply message:', replyMessage);

    if (!replyMessage || replyMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Update inquiry status and add admin response FIRST
    inquiry.status = 'responded';
    inquiry.adminResponse = replyMessage.trim();
    inquiry.respondedAt = new Date();
    await inquiry.save();

    console.log('Inquiry updated successfully, now sending email in background...');

    // Send email in background (non-blocking)
    // This prevents the API from hanging while waiting for email service
    setImmediate(async () => {
      try {
        const product = await getProductDetails(inquiry.productType, inquiry.productId);
        const emailSent = await sendInquiryReplyEmail(inquiry, product, replyMessage.trim(), adminName || 'Yashiper Team');

        if (emailSent) {
          console.log('Background email sent successfully for inquiry:', id);
        } else {
          console.error('Background email failed for inquiry:', id);
        }
      } catch (emailError) {
        console.error('Background email error for inquiry:', id, emailError);
      }
    });

    // Respond immediately to prevent frontend timeout
    res.status(200).json({
      success: true,
      message: 'Reply saved successfully. Email is being sent in the background.',
      data: inquiry
    });

  } catch (error) {
    console.error('Send inquiry reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};

// Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};