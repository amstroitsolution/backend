require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

async function testMenuAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Simulate the API call
    const menuItems = await MenuItem.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    for (const menu of menuItems) {
      if (menu.hasDropdown) {
        const dropdown = await SubMenuItem.find({
          parentMenuId: menu._id,
          isActive: true
        })
          .sort({ order: 1 })
          .lean();
        menu.dropdown = dropdown;
      }
    }

    // Find Wedding menu
    const weddingMenu = menuItems.find(m => m.label === 'Wedding');
    if (weddingMenu) {
      console.log('Wedding Menu:');
      console.log(`  Label: ${weddingMenu.label}`);
      console.log(`  Has Dropdown: ${weddingMenu.hasDropdown}`);
      console.log(`  Dropdown Items: ${weddingMenu.dropdown ? weddingMenu.dropdown.length : 0}`);
      
      if (weddingMenu.dropdown && weddingMenu.dropdown.length > 0) {
        console.log('\n  Subcategories:');
        weddingMenu.dropdown.forEach(item => {
          console.log(`    - ${item.name} (${item.slug})`);
        });
      }
    } else {
      console.log('❌ Wedding menu not found!');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMenuAPI();
