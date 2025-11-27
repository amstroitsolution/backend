const TopStrip = require('../models/TopStrip');

// Get top strip
exports.getTopStrip = async (req, res) => {
  try {
    let topStrip = await TopStrip.findOne();
    
    // Create default if doesn't exist
    if (!topStrip) {
      topStrip = await TopStrip.create({
        message: 'Free Shipping on Orders Above ₹999 | Easy Returns | 24/7 Customer Support',
        isActive: true
      });
    }
    
    res.json(topStrip);
  } catch (error) {
    console.error('Error fetching top strip:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update top strip
exports.updateTopStrip = async (req, res) => {
  try {
    const { message, isActive } = req.body;
    
    let topStrip = await TopStrip.findOne();
    
    if (!topStrip) {
      topStrip = await TopStrip.create({ message, isActive });
    } else {
      topStrip.message = message;
      topStrip.isActive = isActive;
      await topStrip.save();
    }
    
    res.json(topStrip);
  } catch (error) {
    console.error('Error updating top strip:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
