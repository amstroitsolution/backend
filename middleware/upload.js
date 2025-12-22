const multer = require('multer');
const { createCloudinaryStorage } = require('../config/cloudinary');

// Create upload middleware for different types
const createUploadMiddleware = (folder, resourceType = 'image') => {
  const storage = createCloudinaryStorage(folder, resourceType);
  
  return multer({
    storage: storage,
    limits: {
      fileSize: resourceType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024 // 10MB for images, 100MB for videos
    },
    fileFilter: (req, file, cb) => {
      if (resourceType === 'image') {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
          return cb(null, true);
        } else {
          cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'));
        }
      } else if (resourceType === 'video') {
        const allowedTypes = /mp4|mov|avi|webm/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
          return cb(null, true);
        } else {
          cb(new Error('Only video files (MP4, MOV, AVI, WEBM) are allowed!'));
        }
      } else {
        cb(null, true);
      }
    }
  });
};

// Pre-configured upload middlewares
const uploadHero = createUploadMiddleware('hero', 'image');
const uploadKidsHero = createUploadMiddleware('kids-hero', 'image');
const uploadProduct = createUploadMiddleware('products', 'image');
const uploadGallery = createUploadMiddleware('gallery', 'image');
const uploadTestimonial = createUploadMiddleware('testimonials', 'image');
const uploadVideo = createUploadMiddleware('videos', 'video');
const uploadGeneral = createUploadMiddleware('general', 'image');

module.exports = {
  createUploadMiddleware,
  uploadHero,
  uploadKidsHero,
  uploadProduct,
  uploadGallery,
  uploadTestimonial,
  uploadVideo,
  uploadGeneral
};
