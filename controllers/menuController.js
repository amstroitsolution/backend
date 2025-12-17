const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');
const SubCategory = require('../models/SubCategory');

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

// Get active menu items only (with 3-level support)
exports.getActiveMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isActive: true }).sort({ order: 1 });
    const subMenuItems = await SubMenuItem.find({ isActive: true }).sort({ order: 1 });
    const subCategories = await SubCategory.find({ isActive: true }).sort({ order: 1 });
    
    const menuWithSubmenus = menuItems.map(menu => {
      const submenus = subMenuItems.filter(sub => 
        sub.parentMenuId.toString() === menu._id.toString()
      );
      
      return {
        _id: menu._id,
        label: menu.label,
        to: menu.link,
        hasDropdown: menu.hasDropdown,
        dropdown: submenus.map(sub => {
          // Get sub-categories for this submenu
          const subCats = subCategories.filter(sc => 
            sc.parentSubmenuId.toString() === sub._id.toString()
          );
          
          return {
            _id: sub._id,
            name: sub.name,
            slug: sub.slug,
            hasSubCategories: subCats.length > 0,
            subCategories: subCats.map(sc => ({
              _id: sc._id,
              name: sc.name,
              slug: sc.slug,
              description: sc.description,
              image: sc.image
            }))
          };
        })
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
    
    // Delete all sub-categories if SubCategory model exists
    try {
      if (SubCategory) {
        const deleteResult = await SubCategory.deleteMany({ parentSubmenuId: req.params.id });
        console.log(`Deleted ${deleteResult.deletedCount} sub-categories`);
      }
    } catch (subCatError) {
      console.log('No sub-categories to delete or model not found:', subCatError.message);
    }
    
    await submenu.deleteOne();
    res.json({ message: 'Submenu deleted successfully' });
  } catch (error) {
    console.error('Delete submenu error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sub-categories for a submenu
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ parentSubmenuId: req.params.submenuId }).sort({ order: 1 });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create sub-category
exports.createSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.create(req.body);
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update sub-category
exports.updateSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }
    Object.keys(req.body).forEach(key => {
      subCategory[key] = req.body[key];
    });
    await subCategory.save();
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete sub-category
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }
    await subCategory.deleteOne();
    res.json({ message: 'Sub-category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
