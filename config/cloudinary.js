const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with explicit credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary configured with credentials');

// Create storage for different upload types
const createCloudinaryStorage = (folder, resourceType = 'auto') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `yashper/${folder}`,
      resource_type: resourceType === 'auto' ? 'auto' : resourceType,
      allowed_formats: resourceType === 'image' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : undefined
    }
  });
};

module.exports = {
  cloudinary,
  createCloudinaryStorage
};
