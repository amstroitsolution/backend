const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const auth = require('../middleware/auth');

// Section routes
router.get('/', sectionController.getAllSections);
router.get('/active', sectionController.getActiveSections);
router.get('/:id', sectionController.getSectionById);
router.post('/', auth, sectionController.createSection);
router.put('/:id', auth, sectionController.updateSection);
router.delete('/:id', auth, sectionController.deleteSection);

// Section data routes
router.get('/:sectionId/data', sectionController.getSectionData);
router.post('/:sectionId/data', auth, sectionController.createSectionData);
router.put('/:sectionId/data/:dataId', auth, sectionController.updateSectionData);
router.delete('/:sectionId/data/:dataId', auth, sectionController.deleteSectionData);

module.exports = router;
