// backend/routes/workRoutes.js
const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadWorks');
const adminAuth = require('../middleware/auth');

// Controller import
const workCtrl = require('../controllers/workController');

// --- Public routes ---
router.get('/', workCtrl.getAll);
router.get('/:id', workCtrl.getOne);

// --- Admin routes (protected) ---
router.post('/', adminAuth, upload.array('images', 10), workCtrl.createWork);
router.put('/:id', adminAuth, upload.array('images', 10), workCtrl.updateWork);
router.delete('/:id', adminAuth, workCtrl.deleteWork);

module.exports = router;
