// Script to update menu with proper subcategories from products
const mongoose = require('mongoose');
require('dotenv').config();

const menuSchema = new mongoose.Schema({
  label: String,
  to: String,
  hasDropdown: Boolean,
  dropdown: Array,
  isActive: Boolean,
  order: Number
});

const Menu = mongoose.model('Menu', menuSchema);

const womenProductSchema = new mongoose.Schema({
  category: String,
  title: String
}, { collection: 'womenproducts' });

const WomenProduct = mongoose.model('WomenProduct', womenProductSchema);

async function updateMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products and their categories
    const products = await WomenProduct.find({});
    const allCategories = products.map(p => p.category).filter(Boolean);
    const uniqueCategories = [...new Set(allCategories)];

    console.log(`📦 Found ${uniqueCategories.length} unique categories\n`);

    // Group categories by parent
    const categoryGroups = {
      'Dresses': [],
      'Sets': [],
      'Bottoms': [],
      'Kurtas': [],
      'Wedding': []
    };

    uniqueCategories.forEach(cat => {
      if (cat.includes(' → ')) {
        const [parent, subcategory] = cat.split(' → ').map(s => s.trim());
        if (categoryGroups[parent]) {
          categoryGroups[parent].push({
            name: subcategory,
            slug: subcategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
            to: `/${parent.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`
          });
        }
      }
    });

    // Update each menu item
    for (const [menuLabel, subcategories] of Object.entries(categoryGroups)) {
      if (subcategories.length > 0) {
        const menu = await Menu.findOne({ label: menuLabel });
        
        if (menu) {
          menu.dropdown = subcategories;
          menu.hasDropdown = true;
          await menu.save();
          console.log(`✅ Updated ${menuLabel} with ${subcategories.length} subcategories`);
          subcategories.forEach(sub => {
            console.log(`   - ${sub.name}`);
          });
          console.log('');
        } else {
          console.log(`⚠️  Menu item "${menuLabel}" not found`);
        }
      }
    }

    console.log('\n✅ Menu update complete!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateMenu();
