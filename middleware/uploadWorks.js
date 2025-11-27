// backend/middlewares/uploadWorks.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'works');

// ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, base + ext);
  }
});

const fileFilter = function (req, file, cb) {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

module.exports = upload;
