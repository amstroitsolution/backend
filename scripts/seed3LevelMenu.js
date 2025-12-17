const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');
const SubCategory = require('../models/SubCategory');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seed3LevelMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await MenuItem.deleteMany({});
    await SubMenuItem.deleteMany({});
    await SubCategory.deleteMany({});
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

    // Create Level 2: Main Categories
    const dressesSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Dresses',
      slug: 'dresses',
      order: 1,
      isActive: true
    });

    const setsSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Sets',
      slug: 'sets',
      order: 2,
      isActive: true
    });

    const bottomsSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Bottoms',
      slug: 'bottoms',
      order: 3,
      isActive: true
    });

    const kurtasSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Kurtas',
      slug: 'kurtas',
      order: 4,
      isActive: true
    });

    const sareesSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Saree Collections',
      slug: 'saree-collections',
      order: 5,
      isActive: true
    });

    const lehengasSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Lehenga Collections',
      slug: 'lehenga-collections',
      order: 6,
      isActive: true
    });

    const weddingSubmenu = await SubMenuItem.create({
      parentMenuId: womenProductsMenu._id,
      name: 'Wedding',
      slug: 'wedding',
      order: 7,
      isActive: true
    });

    console.log('✅ Created Level 2 categories');

    // Create Level 3: Sub-categories for Dresses
    await SubCategory.create([
      {
        parentSubmenuId: dressesSubmenu._id,
        name: 'Gown & Party Dresses',
        slug: 'gown-party-dresses',
        description: 'Elegant gowns for parties and events',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: dressesSubmenu._id,
        name: 'Insta Sarees',
        slug: 'insta-sarees',
        description: 'Ready-to-wear sarees',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: dressesSubmenu._id,
        name: 'Jumpsuits',
        slug: 'jumpsuits',
        description: 'Trendy jumpsuits',
        order: 3,
        isActive: true
      },
      {
        parentSubmenuId: dressesSubmenu._id,
        name: 'Maxi Dresses',
        slug: 'maxi-dresses',
        description: 'Long flowing dresses',
        order: 4,
        isActive: true
      }
    ]);

    // Create Level 3: Sub-categories for Sets
    await SubCategory.create([
      {
        parentSubmenuId: setsSubmenu._id,
        name: '2 Pcs Kurta Sets',
        slug: '2-pcs-kurta-sets',
        description: 'Two piece kurta sets',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: setsSubmenu._id,
        name: '3 Pcs Kurta Sets',
        slug: '3-pcs-kurta-sets',
        description: 'Three piece kurta sets',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: setsSubmenu._id,
        name: 'Anarkali Sets',
        slug: 'anarkali-sets',
        description: 'Traditional Anarkali sets',
        order: 3,
        isActive: true
      },
      {
        parentSubmenuId: setsSubmenu._id,
        name: 'Sharara Sets',
        slug: 'sharara-sets',
        description: 'Elegant sharara sets',
        order: 4,
        isActive: true
      },
      {
        parentSubmenuId: setsSubmenu._id,
        name: 'Coord Sets',
        slug: 'coord-sets',
        description: 'Matching coordinate sets',
        order: 5,
        isActive: true
      }
    ]);

    // Create Level 3: Sub-categories for Bottoms
    await SubCategory.create([
      {
        parentSubmenuId: bottomsSubmenu._id,
        name: 'Trousers & Pants',
        slug: 'trousers-pants',
        description: 'Formal and casual pants',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: bottomsSubmenu._id,
        name: 'Salwar & Leggings',
        slug: 'salwar-leggings',
        description: 'Traditional salwar and leggings',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: bottomsSubmenu._id,
        name: 'Palazzos & Culottes',
        slug: 'palazzos-culottes',
        description: 'Wide leg pants',
        order: 3,
        isActive: true
      },
      {
        parentSubmenuId: bottomsSubmenu._id,
        name: 'Sharara',
        slug: 'sharara',
        description: 'Traditional sharara bottoms',
        order: 4,
        isActive: true
      },
      {
        parentSubmenuId: bottomsSubmenu._id,
        name: 'Skirts',
        slug: 'skirts',
        description: 'Various styles of skirts',
        order: 5,
        isActive: true
      }
    ]);

    // Create Level 3: Sub-categories for Kurtas
    await SubCategory.create([
      {
        parentSubmenuId: kurtasSubmenu._id,
        name: 'A-Line Kurta',
        slug: 'a-line-kurta',
        description: 'Classic A-line kurtas',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: kurtasSubmenu._id,
        name: 'Straight Kurtas',
        slug: 'straight-kurtas',
        description: 'Straight cut kurtas',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: kurtasSubmenu._id,
        name: 'Flared Kurtas',
        slug: 'flared-kurtas',
        description: 'Flared style kurtas',
        order: 3,
        isActive: true
      },
      {
        parentSubmenuId: kurtasSubmenu._id,
        name: 'Asymmetrical Kurta',
        slug: 'asymmetrical-kurta',
        description: 'Modern asymmetrical designs',
        order: 4,
        isActive: true
      }
    ]);

    // Create Level 3: Sub-categories for Sarees
    await SubCategory.create([
      {
        parentSubmenuId: sareesSubmenu._id,
        name: 'Silk Sarees',
        slug: 'silk-sarees',
        description: 'Pure silk sarees',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: sareesSubmenu._id,
        name: 'Cotton Sarees',
        slug: 'cotton-sarees',
        description: 'Comfortable cotton sarees',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: sareesSubmenu._id,
        name: 'Designer Sarees',
        slug: 'designer-sarees',
        description: 'Designer collection sarees',
        order: 3,
        isActive: true
      },
      {
        parentSubmenuId: sareesSubmenu._id,
        name: 'Party Wear Sarees',
        slug: 'party-wear-sarees',
        description: 'Sarees for parties',
        order: 4,
        isActive: true
      },
      {
        parentSubmenuId: sareesSubmenu._id,
        name: 'Bridal Sarees',
        slug: 'bridal-sarees',
        description: 'Wedding sarees',
        order: 5,
        isActive: true
      }
    ]);

    // Create Level 3: Sub-categories for Lehengas
    await SubCategory.create([
      {
        parentSubmenuId: lehengasSubmenu._id,
        name: 'Bridal Lehengas',
        slug: 'bridal-lehengas',
        description: 'Wedding lehengas',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: lehengasSubmenu._id,
        name: 'Party Wear Lehengas',
        slug: 'party-wear-lehengas',
        description: 'Lehengas for parties',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: lehengasSubmenu._id,
        name: 'Designer Lehengas',
        slug: 'designer-lehengas',
        description: 'Designer collection',
        order: 3,
        isActive: true
      },
      {
        parentSubmenuId: lehengasSubmenu._id,
        name: 'Festive Lehengas',
        slug: 'festive-lehengas',
        description: 'Festival wear lehengas',
        order: 4,
        isActive: true
      }
    ]);

    // Create Level 3: Sub-categories for Wedding
    await SubCategory.create([
      {
        parentSubmenuId: weddingSubmenu._id,
        name: 'Bridal Wear',
        slug: 'bridal-wear',
        description: 'Complete bridal collection',
        order: 1,
        isActive: true
      },
      {
        parentSubmenuId: weddingSubmenu._id,
        name: 'Bridesmaid Dresses',
        slug: 'bridesmaid-dresses',
        description: 'Dresses for bridesmaids',
        order: 2,
        isActive: true
      },
      {
        parentSubmenuId: weddingSubmenu._id,
        name: 'Wedding Guest Outfits',
        slug: 'wedding-guest-outfits',
        description: 'Outfits for wedding guests',
        order: 3,
        isActive: true
      }
    ]);

    console.log('✅ Created Level 3 sub-categories');
    console.log('\n🎉 3-Level menu structure created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Main Menus: 5`);
    console.log(`   - Level 2 Categories: 7`);
    console.log(`   - Level 3 Sub-categories: 30+`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  }
};

seed3LevelMenu();
