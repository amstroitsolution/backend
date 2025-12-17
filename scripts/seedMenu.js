const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

dotenv.config({ path: path.join(__dirname, '../.env') });

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

    const womenProductsMenu = await MenuItem.create({
      label: 'Women Products',
      link: '/women-products',
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

    // Create submenu items for Women Products (comprehensive categories)
    const womenProductsSubmenus = [
      { name: 'Dresses', slug: 'dresses', order: 1 },
      { name: 'Gown and Dresses', slug: 'gown-and-dresses', order: 2 },
      { name: 'Sets', slug: 'sets', order: 3 },
      { name: 'Bottoms', slug: 'bottoms', order: 4 },
      { name: 'Kurtas', slug: 'kurtas', order: 5 },
      { name: 'Kurti', slug: 'kurti', order: 6 },
      { name: 'Insta Sarees', slug: 'insta-sarees', order: 7 },
      { name: 'Saree Collections', slug: 'saree-collections', order: 8 },
      { name: 'Lehenga', slug: 'lehenga', order: 9 },
      { name: 'Lehenga Collections', slug: 'lehenga-collections', order: 10 },
      { name: 'Sharara', slug: 'sharara', order: 11 },
      { name: 'Wedding', slug: 'wedding', order: 12 },
      { name: 'Party Wear', slug: 'party-wear', order: 13 },
      { name: 'Casual Wear', slug: 'casual-wear', order: 14 },
      { name: 'Ethnic Wear', slug: 'ethnic-wear', order: 15 }
    ];

    for (const submenu of womenProductsSubmenus) {
      await SubMenuItem.create({
        parentMenuId: womenProductsMenu._id,
        name: submenu.name,
        slug: submenu.slug,
        order: submenu.order,
        isActive: true
      });
    }

    console.log('✅ Created submenu items for Women Products');
    console.log('🎉 Menu seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  }
};

seedMenu();
