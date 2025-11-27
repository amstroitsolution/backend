const express = require('express');
const router = express.Router();
const kidsSectionController = require('../controllers/kidsSectionController');
const auth = require('../middleware/auth');

// Kids Section routes
router.get('/', kidsSectionController.getAllKidsSections);
router.get('/active', kidsSectionController.getActiveKidsSections);
router.get('/:id', kidsSectionController.getKidsSectionById);
router.post('/', auth, kidsSectionController.createKidsSection);
router.put('/:id', auth, kidsSectionController.updateKidsSection);
router.delete('/:id', auth, kidsSectionController.deleteKidsSection);

// Kids Section data routes
router.get('/:sectionId/data', kidsSectionController.getKidsSectionData);
router.post('/:sectionId/data', auth, kidsSectionController.createKidsSectionData);
router.put('/:sectionId/data/:dataId', auth, kidsSectionController.updateKidsSectionData);
router.delete('/:sectionId/data/:dataId', auth, kidsSectionController.deleteKidsSectionData);

module.exports = router;
