const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

// Get all menu items with their submenus
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ order: 1 });
    const subMenuItems = await SubMenuItem.find().sort({ order: 1 });
    
    // Group submenus by parent
    const menuWithSubmenus = menuItems.map(menu => {
      const submenus = subMenuItems.filter(sub => 
        sub.parentMenuId.toString() === menu._id.toString()
      );
      return {
        ...menu.toObject(),
        dropdown: submenus
      };
    });
    
    res.json(menuWithSubmenus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active menu items only
exports.getActiveMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isActive: true }).sort({ order: 1 });
    const subMenuItems = await SubMenuItem.find({ isActive: true }).sort({ order: 1 });
    
    const menuWithSubmenus = menuItems.map(menu => {
      const submenus = subMenuItems.filter(sub => 
        sub.parentMenuId.toString() === menu._id.toString()
      );
      return {
        _id: menu._id,
        label: menu.label,
        to: menu.link,
        hasDropdown: menu.hasDropdown,
        dropdown: submenus.map(sub => ({
          _id: sub._id,
          name: sub.name,
          slug: sub.slug
        }))
      };
    });
    
    res.json(menuWithSubmenus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    Object.keys(req.body).forEach(key => {
      menuItem[key] = req.body[key];
    });
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    // Delete all submenus
    await SubMenuItem.deleteMany({ parentMenuId: req.params.id });
    await menuItem.deleteOne();
    res.json({ message: 'Menu item and submenus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get submenus for a parent
exports.getSubMenus = async (req, res) => {
  try {
    const submenus = await SubMenuItem.find({ parentMenuId: req.params.parentId }).sort({ order: 1 });
    res.json(submenus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create submenu
exports.createSubMenu = async (req, res) => {
  try {
    const submenu = await SubMenuItem.create(req.body);
    res.status(201).json(submenu);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update submenu
exports.updateSubMenu = async (req, res) => {
  try {
    const submenu = await SubMenuItem.findById(req.params.id);
    if (!submenu) {
      return res.status(404).json({ message: 'Submenu not found' });
    }
    Object.keys(req.body).forEach(key => {
      submenu[key] = req.body[key];
    });
    await submenu.save();
    res.json(submenu);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete submenu
exports.deleteSubMenu = async (req, res) => {
  try {
    const submenu = await SubMenuItem.findById(req.params.id);
    if (!submenu) {
      return res.status(404).json({ message: 'Submenu not found' });
    }
    await submenu.deleteOne();
    res.json({ message: 'Submenu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
