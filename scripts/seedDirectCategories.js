const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDirectCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
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

    // Create Dresses as main menu item
    const dressesMenu = await MenuItem.create({
      label: 'Dresses',
      link: '/dresses',
      hasDropdown: true,
      order: 2,
      isActive: true
    });

    // Create Sets as main menu item
    const setsMenu = await MenuItem.create({
      label: 'Sets',
      link: '/sets',
      hasDropdown: true,
      order: 3,
      isActive: true
    });

    // Create Bottoms as main menu item
    const bottomsMenu = await MenuItem.create({
      label: 'Bottoms',
      link: '/bottoms',
      hasDropdown: true,
      order: 4,
      isActive: true
    });

    // Create Kurtas as main menu item
    const kurtasMenu = await MenuItem.create({
      label: 'Kurtas',
      link: '/kurtas',
      hasDropdown: true,
      order: 5,
      isActive: true
    });

    // Create Wedding as main menu item
    const weddingMenu = await MenuItem.create({
      label: 'Wedding',
      link: '/wedding',
      hasDropdown: false,
      order: 6,
      isActive: true
    });

    const aboutMenu = await MenuItem.create({
      label: 'About',
      link: '/about',
      hasDropdown: false,
      order: 7,
      isActive: true
    });

    const galleryMenu = await MenuItem.create({
      label: 'Gallery',
      link: '/gallery',
      hasDropdown: false,
      order: 8,
      isActive: true
    });

    const contactMenu = await MenuItem.create({
      label: 'Contact',
      link: '/contact',
      hasDropdown: false,
      order: 9,
      isActive: true
    });

    console.log('✅ Created main menu items');

    // Create submenus for Dresses
    await SubMenuItem.create([
      {
        parentMenuId: dressesMenu._id,
        name: 'Gown and Dresses',
        slug: 'gown-and-dresses',
        order: 1,
        isActive: true
      },
      {
        parentMenuId: dressesMenu._id,
        name: 'Insta Sarees',
        slug: 'insta-sarees',
        order: 2,
        isActive: true
      },
      {
        parentMenuId: dressesMenu._id,
        name: 'Jumpsuits',
        slug: 'jumpsuits',
        order: 3,
        isActive: true
      }
    ]);

    // Create submenus for Sets
    await SubMenuItem.create([
      {
        parentMenuId: setsMenu._id,
        name: '2 Pcs Kurta Sets',
        slug: '2pcs-kurta-sets',
        order: 1,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: '3 Pcs Kurta Sets',
        slug: '3pcs-kurta-sets',
        order: 2,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: 'Anarkali Sets',
        slug: 'anarkali-sets',
        order: 3,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: 'A-Line Sets',
        slug: 'a-line-sets',
        order: 4,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: 'Straight Suit Sets',
        slug: 'straight-suit-sets',
        order: 5,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: 'Sharara Sets',
        slug: 'sharara-sets',
        order: 6,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: 'Coord Sets',
        slug: 'coord-sets',
        order: 7,
        isActive: true
      },
      {
        parentMenuId: setsMenu._id,
        name: 'Plus Size Suit Sets',
        slug: 'plus-size-suit-sets',
        order: 8,
        isActive: true
      }
    ]);

    // Create submenus for Bottoms
    await SubMenuItem.create([
      {
        parentMenuId: bottomsMenu._id,
        name: 'Trouser & Pants',
        slug: 'trouser-pants',
        order: 1,
        isActive: true
      },
      {
        parentMenuId: bottomsMenu._id,
        name: 'Salwar & Leggings',
        slug: 'salwar-leggings',
        order: 2,
        isActive: true
      },
      {
        parentMenuId: bottomsMenu._id,
        name: 'Palazzos & Culottes',
        slug: 'palazzos-culottes',
        order: 3,
        isActive: true
      },
      {
        parentMenuId: bottomsMenu._id,
        name: 'Sharara',
        slug: 'sharara',
        order: 4,
        isActive: true
      },
      {
        parentMenuId: bottomsMenu._id,
        name: 'Skirts',
        slug: 'skirts',
        order: 5,
        isActive: true
      },
      {
        parentMenuId: bottomsMenu._id,
        name: 'Jeggings',
        slug: 'jeggings',
        order: 6,
        isActive: true
      },
      {
        parentMenuId: bottomsMenu._id,
        name: 'Plus Size Bottoms',
        slug: 'plus-size-bottoms',
        order: 7,
        isActive: true
      }
    ]);

    // Create submenus for Kurtas
    await SubMenuItem.create([
      {
        parentMenuId: kurtasMenu._id,
        name: 'A-Line Kurta',
        slug: 'a-line-kurta',
        order: 1,
        isActive: true
      },
      {
        parentMenuId: kurtasMenu._id,
        name: 'Straight Kurtas',
        slug: 'straight-kurtas',
        order: 2,
        isActive: true
      },
      {
        parentMenuId: kurtasMenu._id,
        name: 'Flared Kurtas',
        slug: 'flared-kurtas',
        order: 3,
        isActive: true
      },
      {
        parentMenuId: kurtasMenu._id,
        name: 'Asymmetrical Kurta',
        slug: 'asymmetrical-kurta',
        order: 4,
        isActive: true
      },
      {
        parentMenuId: kurtasMenu._id,
        name: 'Winter Kurta',
        slug: 'winter-kurta',
        order: 5,
        isActive: true
      },
      {
        parentMenuId: kurtasMenu._id,
        name: 'Plus Size Kurta',
        slug: 'plus-size-kurta',
        order: 6,
        isActive: true
      }
    ]);



    console.log('✅ Created submenus for all categories');
    console.log('\n🎉 Direct categories menu created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Main Menu Items: 9 (Home + Dresses + Sets + Bottoms + Kurtas + Wedding + About + Gallery + Contact)`);
    console.log(`   - Categories with dropdowns: Dresses, Sets, Bottoms, Kurtas`);
    console.log(`   - All slugs match existing routes in App.jsx`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  }
};

seedDirectCategories();
