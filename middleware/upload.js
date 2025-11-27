const multer = require("multer");
const path = require("path");

// Storage config: decide destination & file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 17245643.jpg
  },
});

// File type filter: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) cb(null, true);
  else cb(new Error("Only .jpg, .jpeg, .png and .webp files are allowed!"));
};

// Create upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
