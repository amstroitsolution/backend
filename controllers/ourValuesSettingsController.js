const OurValuesSettings = require('../models/OurValuesSettings');

// @desc    Get Our Values Settings
// @route   GET /api/our-values-settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await OurValuesSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await OurValuesSettings.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// @desc    Update Our Values Settings
// @route   PUT /api/our-values-settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    console.log('🔄 Updating Our Values Settings');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : 'No file uploaded');

    let settings = await OurValuesSettings.findOne();

    const updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      const imagePath = req.file.path;
      updateData.sectionImage = imagePath;
      console.log('✅ Image uploaded successfully to Cloudinary:', imagePath);
    } else if (req.body.sectionImageUrl) {
      updateData.sectionImage = req.body.sectionImageUrl;
      console.log('🔗 Using existing image URL:', req.body.sectionImageUrl);
    }

    console.log('Update data:', updateData);

    if (!settings) {
      // Create if doesn't exist
      settings = await OurValuesSettings.create(updateData);
      console.log('✅ Created new settings:', settings);
    } else {
      // Update existing
      settings = await OurValuesSettings.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true, runValidators: true }
      );
      console.log('✅ Updated existing settings:', settings);
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('❌ Error updating Our Values settings:', error);
    res.status(400).json({ message: 'Error updating settings', error: error.message });
  }
};
