// Setup menu with proper MenuItem and SubMenuItem structure
const mongoose = require('mongoose');
require('dotenv').config();

const menuItemSchema = new mongoose.Schema({
  label: String,
  link: String,
  hasDropdown: Boolean,
  order: Number,
  isActive: Boolean
});

const subMenuItemSchema = new mongoose.Schema({
  parentMenuId: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
  link: String,
  order: Number,
  isActive: Boolean
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const SubMenuItem = mongoose.model('SubMenuItem', subMenuItemSchema);

const womenProductSchema = new mongoose.Schema({
  category: String
}, { collection: 'womenproducts' });

const WomenProduct = mongoose.model('WomenProduct', womenProductSchema);

async function setupMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get categories from products
    const products = await WomenProduct.find({});
    const allCategories = products.map(p => p.category).filter(Boolean);
    const uniqueCategories = [...new Set(allCategories)];

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
          categoryGroups[parent].push(subcategory);
        }
      }
    });

    // Clear existing data
    await MenuItem.deleteMany({});
    await SubMenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu data\n');

    // Create main menu items
    const menuData = [
      { label: 'Home', link: '/', hasDropdown: false, order: 1 },
      { label: 'Dresses', link: '/dresses', hasDropdown: true, order: 2 },
      { label: 'Sets', link: '/sets', hasDropdown: true, order: 3 },
      { label: 'Bottoms', link: '/bottoms', hasDropdown: true, order: 4 },
      { label: 'Kurtas', link: '/kurtas', hasDropdown: true, order: 5 },
      { label: 'Wedding', link: '/wedding', hasDropdown: true, order: 6 },
      { label: 'About', link: '/about', hasDropdown: false, order: 7 },
      { label: 'Gallery', link: '/gallery', hasDropdown: false, order: 8 },
      { label: 'Contact', link: '/contact', hasDropdown: false, order: 9 }
    ];

    const createdMenus = await MenuItem.insertMany(menuData.map(m => ({ ...m, isActive: true })));
    console.log('✅ Created main menu items\n');

    // Create submenus for each category
    let subMenuOrder = 1;
    for (const menu of createdMenus) {
      if (categoryGroups[menu.label] && categoryGroups[menu.label].length > 0) {
        const subMenus = categoryGroups[menu.label].map((subcat, index) => ({
          parentMenuId: menu._id,
          name: subcat,
          slug: subcat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
          link: `/${menu.label.toLowerCase()}/${subcat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
          order: index + 1,
          isActive: true
        }));

        await SubMenuItem.insertMany(subMenus);
        console.log(`✅ ${menu.label}: Added ${subMenus.length} subcategories`);
        subMenus.forEach(sub => {
          console.log(`   - ${sub.name}`);
        });
        console.log('');
      }
    }

    console.log('\n🎉 Menu setup complete!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupMenu();
