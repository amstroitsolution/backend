const express = require('express');
const router = express.Router();
const controller = require('../controllers/trendingItemController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', controller.getAll);
router.post('/', upload.array('images', 5), controller.create);
router.put('/:id', upload.array('images', 5), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
