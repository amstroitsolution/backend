// backend/routes/workRoutes.js
const express = require('express');
const router = express.Router();

const { uploadWorks } = require('../middleware/upload');
const adminAuth = require('../middleware/auth');

// Controller import
const workCtrl = require('../controllers/workController');

// --- Public routes ---
router.get('/', workCtrl.getAll);
router.get('/:id', workCtrl.getOne);

// --- Admin routes (protected) ---
router.post('/', adminAuth, uploadWorks.array('images', 10), workCtrl.createWork);
router.put('/:id', adminAuth, uploadWorks.array('images', 10), workCtrl.updateWork);
router.delete('/:id', adminAuth, workCtrl.deleteWork);

module.exports = router;
