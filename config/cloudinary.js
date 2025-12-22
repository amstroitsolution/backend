const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
// Supports both CLOUDINARY_URL and individual credentials
if (process.env.CLOUDINARY_URL) {
  // Use CLOUDINARY_URL if provided (easier setup)
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
  console.log('✅ Cloudinary configured with CLOUDINARY_URL');
} else {
  // Fallback to individual credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured with individual credentials');
}

// Create storage for different upload types
const createCloudinaryStorage = (folder, resourceType = 'image') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `yashper/${folder}`,
      resource_type: resourceType,
      allowed_formats: resourceType === 'image' 
        ? ['jpg', 'jpeg', 'png', 'gif', 'webp']
        : ['mp4', 'mov', 'avi', 'webm'],
      transformation: resourceType === 'image' 
        ? [{ quality: 'auto', fetch_format: 'auto' }]
        : undefined
    }
  });
};

module.exports = {
  cloudinary,
  createCloudinaryStorage
};
