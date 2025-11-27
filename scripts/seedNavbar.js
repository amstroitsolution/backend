const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedNavbar = async () => {
  try {
    console.log('🌱 Seeding Navbar Menu Items...\n');

    // Clear existing data
    await MenuItem.deleteMany({});
    await SubMenuItem.deleteMany({});

    // Create main menu items
    const menuItems = [
      { label: 'Home', link: '/', hasDropdown: false, order: 1 },
      { label: 'Dresses', link: '/dresses', hasDropdown: true, order: 2 },
      { label: 'Sets', link: '/sets', hasDropdown: true, order: 3 },
      { label: 'Bottoms', link: '/bottoms', hasDropdown: true, order: 4 },
      { label: 'Kurtas', link: '/kurtas', hasDropdown: true, order: 5 },
      { label: 'Wedding', link: '/wedding', hasDropdown: false, order: 6 },
      { label: 'About', link: '/about', hasDropdown: false, order: 7 },
      { label: 'Contact', link: '/contact', hasDropdown: false, order: 8 }
    ];

    const createdMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Created ${createdMenuItems.length} main menu items`);

    // Find menu items by label for submenu creation
    const dressesMenu = createdMenuItems.find(m => m.label === 'Dresses');
    const setsMenu = createdMenuItems.find(m => m.label === 'Sets');
    const bottomsMenu = createdMenuItems.find(m => m.label === 'Bottoms');
    const kurtasMenu = createdMenuItems.find(m => m.label === 'Kurtas');

    // Create submenu items
    const subMenuItems = [
      // Dresses submenu
      { parentMenuId: dressesMenu._id, name: 'Gown and Dresses', slug: 'gown-and-dresses', order: 1 },
      { parentMenuId: dressesMenu._id, name: 'Insta Sarees', slug: 'insta-sarees', order: 2 },
      { parentMenuId: dressesMenu._id, name: 'Jumpsuits', slug: 'jumpsuits', order: 3 },

      // Sets submenu
      { parentMenuId: setsMenu._id, name: '2 pcs Kurta Sets', slug: '2pcs-kurta-sets', order: 1 },
      { parentMenuId: setsMenu._id, name: '3 pcs Kurta Sets', slug: '3pcs-kurta-sets', order: 2 },
      { parentMenuId: setsMenu._id, name: 'Anarkali Sets', slug: 'anarkali-sets', order: 3 },
      { parentMenuId: setsMenu._id, name: 'A-line Sets', slug: 'a-line-sets', order: 4 },
      { parentMenuId: setsMenu._id, name: 'Straight Suit Sets', slug: 'straight-suit-sets', order: 5 },
      { parentMenuId: setsMenu._id, name: 'Sharara Sets', slug: 'sharara-sets', order: 6 },
      { parentMenuId: setsMenu._id, name: 'Coord Sets', slug: 'coord-sets', order: 7 },
      { parentMenuId: setsMenu._id, name: 'Plus Size Suit Sets', slug: 'plus-size-suit-sets', order: 8 },

      // Bottoms submenu
      { parentMenuId: bottomsMenu._id, name: 'Trouser & Pants', slug: 'trouser-pants', order: 1 },
      { parentMenuId: bottomsMenu._id, name: 'Salwar & Leggings', slug: 'salwar-leggings', order: 2 },
      { parentMenuId: bottomsMenu._id, name: 'Palazzos & Culottes', slug: 'palazzos-culottes', order: 3 },
      { parentMenuId: bottomsMenu._id, name: 'Sharara', slug: 'sharara', order: 4 },
      { parentMenuId: bottomsMenu._id, name: 'Skirts', slug: 'skirts', order: 5 },
      { parentMenuId: bottomsMenu._id, name: 'Jeggings', slug: 'jeggings', order: 6 },
      { parentMenuId: bottomsMenu._id, name: 'Plus Size Bottoms', slug: 'plus-size-bottoms', order: 7 },

      // Kurtas submenu
      { parentMenuId: kurtasMenu._id, name: 'A-line Kurta', slug: 'a-line-kurta', order: 1 },
      { parentMenuId: kurtasMenu._id, name: 'Straight Kurtas', slug: 'straight-kurtas', order: 2 },
      { parentMenuId: kurtasMenu._id, name: 'Flared Kurtas', slug: 'flared-kurtas', order: 3 },
      { parentMenuId: kurtasMenu._id, name: 'Asymmetrical Kurta', slug: 'asymmetrical-kurta', order: 4 },
      { parentMenuId: kurtasMenu._id, name: 'Winter Kurta', slug: 'winter-kurta', order: 5 },
      { parentMenuId: kurtasMenu._id, name: 'Plus Size Kurta', slug: 'plus-size-kurta', order: 6 }
    ];

    const createdSubMenuItems = await SubMenuItem.insertMany(subMenuItems);
    console.log(`✅ Created ${createdSubMenuItems.length} submenu items`);

    console.log('\n🎉 Navbar seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`   - Main Menu Items: ${createdMenuItems.length}`);
    console.log(`   - Submenu Items: ${createdSubMenuItems.length}`);
    console.log('\n✅ You can now manage the navbar from admin panel!');

  } catch (error) {
    console.error('❌ Error seeding navbar:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

const run = async () => {
  await connectDB();
  await seedNavbar();
};

run();
