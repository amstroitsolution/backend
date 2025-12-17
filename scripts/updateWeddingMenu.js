require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const SubCategory = require('../models/SubCategory');
const SubMenuItem = require('../models/SubMenuItem');
const MenuItem = require('../models/MenuItem');

async function updateWeddingMenu() {
  try {
    console.log('🔄 Updating Wedding menu subcategories...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find Wedding menu (it's a main menu item, not submenu)
    const weddingMenu = await MenuItem.findOne({ label: 'Wedding' });
    if (!weddingMenu) {
      console.error('❌ Wedding menu not found!');
      process.exit(1);
    }
    console.log('✅ Found Wedding menu\n');

    // Enable dropdown for Wedding menu
    await MenuItem.findByIdAndUpdate(weddingMenu._id, { hasDropdown: true });
    console.log('✅ Enabled dropdown for Wedding menu\n');

    // Delete old dropdown items
    const deletedCount = await SubMenuItem.deleteMany({ 
      parentMenuId: weddingMenu._id 
    });
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} old dropdown items\n`);

    // Create new dropdown items (subcategories)
    const newSubcategories = await SubMenuItem.create([
      {
        parentMenuId: weddingMenu._id,
        name: 'Bridal Lehengas',
        slug: 'bridal-lehengas',
        description: 'Beautiful bridal lehengas',
        order: 1,
        isActive: true
      },
      {
        parentMenuId: weddingMenu._id,
        name: 'Silk Sarees',
        slug: 'silk-sarees',
        description: 'Elegant silk sarees',
        order: 2,
        isActive: true
      },
      {
        parentMenuId: weddingMenu._id,
        name: 'Cotton Sarees',
        slug: 'cotton-sarees',
        description: 'Comfortable cotton sarees',
        order: 3,
        isActive: true
      },
      {
        parentMenuId: weddingMenu._id,
        name: 'Designer Sarees',
        slug: 'designer-sarees',
        description: 'Designer collection sarees',
        order: 4,
        isActive: true
      },
      {
        parentMenuId: weddingMenu._id,
        name: 'Party Wear Lehengas',
        slug: 'party-wear-lehengas',
        description: 'Lehengas for parties',
        order: 5,
        isActive: true
      }
    ]);

    console.log('✅ Created new subcategories:');
    newSubcategories.forEach(sub => {
      console.log(`   - ${sub.name} (${sub.slug})`);
    });

    console.log('\n🎉 Wedding menu updated successfully!');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateWeddingMenu();
