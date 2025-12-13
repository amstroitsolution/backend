const nodemailer = require('nodemailer');
const { 
  fallbackAdminNotification, 
  fallbackCustomerConfirmation, 
  fallbackReplyToCustomer 
} = require('./fallbackEmailService');

// Create transporter with multiple fallback options
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass exists:', !!process.env.EMAIL_PASS);
  
  // Try Gmail SMTP with explicit configuration
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Enable debug logs
    logger: true // Enable logger
  });
};

// Send email to admin about new contact message
const sendContactNotificationToAdmin = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    // Test the connection first
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Message</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">You have received a new message from your website</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
              
              <div style="margin: 20px 0;">
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 120px; display: inline-block;">Name:</strong>
                  <span style="color: #333;">${contactData.name}</span>
                </div>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 120px; display: inline-block;">Email:</strong>
                  <span style="color: #333;">${contactData.email}</span>
                </div>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 120px; display: inline-block;">Phone:</strong>
                  <span style="color: #333;">${contactData.phone}</span>
                </div>
                
                <div style="display: flex; margin-bottom: 15px;">
                  <strong style="color: #667eea; width: 120px; display: inline-block;">Subject:</strong>
                  <span style="color: #333;">${contactData.subject}</span>
                </div>
                
                <div style="margin-top: 20px;">
                  <strong style="color: #667eea; display: block; margin-bottom: 10px;">Message:</strong>
                  <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px; line-height: 1.6; color: #333;">
                    ${contactData.message}
                  </div>
                </div>
              </div>
              
              <div style="margin-top: 25px; padding: 15px; background: #e8f2ff; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #333; font-size: 14px;">
                  <strong>📅 Received:</strong> ${new Date().toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              This email was sent from your website contact form. Please respond to the customer directly at ${contactData.email}
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification sent to admin successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact notification to admin:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    // Use fallback service
    console.log('Using fallback email service for admin notification...');
    return await fallbackAdminNotification(contactData);
  }
};

// Send confirmation email to customer
const sendContactConfirmationToCustomer = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    // Test the connection first
    await transporter.verify();
    console.log('SMTP connection verified for customer email');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: 'Thank you for contacting us - We received your message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">We have received your message and will get back to you soon</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hello ${contactData.name}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to us. We have successfully received your message and our team will review it shortly. 
                We typically respond within 24-48 hours during business days.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Your Message Summary:</h3>
                
                <div style="margin-bottom: 10px;">
                  <strong style="color: #667eea;">Subject:</strong> ${contactData.subject}
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #667eea;">Message:</strong>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 4px; color: #333; line-height: 1.6;">
                  ${contactData.message}
                </div>
                
                <div style="margin-top: 15px; font-size: 14px; color: #666;">
                  <strong>Submitted on:</strong> ${new Date().toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #2d5a2d; margin-top: 0; margin-bottom: 10px;">📞 Need Immediate Assistance?</h3>
                <p style="color: #2d5a2d; margin: 0; line-height: 1.6;">
                  If your inquiry is urgent, feel free to call us at <strong>+91 98765 43210</strong> during business hours 
                  (Mon-Sat: 9:00 AM - 8:00 PM, Sunday: 10:00 AM - 6:00 PM).
                </p>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <p style="color: #666; margin-bottom: 15px;">Follow us on social media for updates and latest collections:</p>
                <div style="display: inline-block;">
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Facebook</a>
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Instagram</a>
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Yashiper Fashion</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              FF 06, Global Foyer Mall, Sector 1, Pocket H, Palam Vihar, Gurugram, Haryana - 122017 | Email: yashper9@gmail.com | Phone: +91 98765 43210
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact confirmation sent to customer successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact confirmation to customer:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    // Use fallback service
    console.log('Using fallback email service for customer confirmation...');
    return await fallbackCustomerConfirmation(contactData);
  }
};

// Send reply email to customer from admin
const sendReplyToCustomer = async (contactData, replyMessage, adminName = 'Yashiper Team') => {
  try {
    const transporter = createTransporter();
    
    // Test the connection first
    await transporter.verify();
    console.log('SMTP connection verified for reply email');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: `Re: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Response to Your Inquiry</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Thank you for contacting Yashiper Fashion</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9fa;">
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hello ${contactData.name}!</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your inquiry regarding "<strong>${contactData.subject}</strong>". 
                We have reviewed your message and here is our response:
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
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
                  "${contactData.message}"
                </p>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <p style="color: #666; margin-bottom: 15px;">Follow us for latest updates:</p>
                <div style="display: inline-block;">
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Facebook</a>
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">Instagram</a>
                  <a href="#" style="display: inline-block; margin: 0 10px; padding: 10px 15px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-size: 14px;">WhatsApp</a>
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
    console.log('Reply sent to customer successfully');
    return true;
  } catch (error) {
    console.error('Error sending reply to customer:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    // Use fallback service
    console.log('Using fallback email service for reply...');
    return await fallbackReplyToCustomer(contactData, replyMessage, adminName);
  }
};

module.exports = {
  sendContactNotificationToAdmin,
  sendContactConfirmationToCustomer,
  sendReplyToCustomer
};