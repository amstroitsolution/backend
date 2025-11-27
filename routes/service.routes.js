const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/service.controller');
const upload = require('../middleware/upload');  
const auth = require('../middleware/auth');     

// Public
router.get('/services', serviceCtrl.getList);
router.get('/services/:slug', serviceCtrl.getBySlug);

// Admin
router.post('/admin/services', auth, upload.single('image'), serviceCtrl.create);
router.patch('/admin/services/:id', auth, upload.fields([{ name: 'gallery', maxCount: 5 }]), serviceCtrl.update);
router.delete('/admin/services/:id', auth, serviceCtrl.delete);

module.exports = router;
