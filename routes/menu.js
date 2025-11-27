const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getActiveMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getSubMenus,
  createSubMenu,
  updateSubMenu,
  deleteSubMenu
} = require('../controllers/menuController');
const protect = require('../middleware/auth');

// Public routes
router.get('/', getAllMenuItems);
router.get('/active', getActiveMenuItems);
router.get('/:parentId/submenus', getSubMenus);

// Protected routes - Menu Items
router.post('/', protect, createMenuItem);
router.put('/:id', protect, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

// Protected routes - Submenus
router.post('/submenus', protect, createSubMenu);
router.put('/submenus/:id', protect, updateSubMenu);
router.delete('/submenus/:id', protect, deleteSubMenu);

module.exports = router;
