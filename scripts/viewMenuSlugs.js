const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

const viewMenuSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const menuItems = await MenuItem.find().sort({ order: 1 });
    const subMenuItems = await SubMenuItem.find().sort({ order: 1 });

    console.log('📋 CURRENT MENU STRUCTURE\n');
    console.log('='.repeat(60));

    for (const menu of menuItems) {
      console.log(`\n📁 ${menu.label}`);
      console.log(`   Link: ${menu.link}`);
      console.log(`   Has Dropdown: ${menu.hasDropdown}`);
      console.log(`   Active: ${menu.isActive}`);

      if (menu.hasDropdown) {
        const submenus = subMenuItems.filter(sub => 
          sub.parentMenuId.toString() === menu._id.toString()
        );

        if (submenus.length > 0) {
          console.log(`\n   Submenus (${submenus.length}):`);
          submenus.forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.name}`);
            console.log(`      Slug: ${sub.slug}`);
            console.log(`      Full URL: ${menu.link}/${sub.slug}`);
            console.log(`      Active: ${sub.isActive}`);
          });
        }
      }
      console.log('\n' + '-'.repeat(60));
    }

    console.log('\n✅ Menu structure displayed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

viewMenuSlugs();
