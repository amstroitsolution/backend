const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

dotenv.config({ path: '../.env' });

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    await SubMenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Create main menu items
    const homeMenu = await MenuItem.create({
      label: 'Home',
      link: '/',
      hasDropdown: false,
      order: 1,
      isActive: true
    });

    const dressesMenu = await MenuItem.create({
      label: 'Dresses',
      link: '/dresses',
      hasDropdown: true,
      order: 2,
      isActive: true
    });

    const aboutMenu = await MenuItem.create({
      label: 'About',
      link: '/about',
      hasDropdown: false,
      order: 3,
      isActive: true
    });

    const galleryMenu = await MenuItem.create({
      label: 'Gallery',
      link: '/gallery',
      hasDropdown: false,
      order: 4,
      isActive: true
    });

    const contactMenu = await MenuItem.create({
      label: 'Contact',
      link: '/contact',
      hasDropdown: false,
      order: 5,
      isActive: true
    });

    console.log('✅ Created main menu items');

    // Create submenu items for Dresses
    const dressesSubmenus = [
      { name: 'Gown and Dresses', slug: 'gown-and-dresses', order: 1 },
      { name: 'Insta Sarees', slug: 'insta-sarees', order: 2 },
      { name: 'Lehenga', slug: 'lehenga', order: 3 },
      { name: 'Kurti', slug: 'kurti', order: 4 },
      { name: 'Sharara', slug: 'sharara', order: 5 }
    ];

    for (const submenu of dressesSubmenus) {
      await SubMenuItem.create({
        parentMenuId: dressesMenu._id,
        name: submenu.name,
        slug: submenu.slug,
        order: submenu.order,
        isActive: true
      });
    }

    console.log('✅ Created submenu items for Dresses');
    console.log('🎉 Menu seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  }
};

seedMenu();
