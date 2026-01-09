// Setup complete menu with all categories
const mongoose = require('mongoose');
require('dotenv').config();

const menuSchema = new mongoose.Schema({
  label: String,
  to: String,
  link: String,
  hasDropdown: Boolean,
  dropdown: Array,
  isActive: Boolean,
  order: Number
});

const Menu = mongoose.model('Menu', menuSchema);

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
          categoryGroups[parent].push({
            name: subcategory,
            slug: subcategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
            to: `/${parent.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`
          });
        }
      }
    });

    // Clear existing menu
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing menu\n');

    // Create menu items
    const menuItems = [
      {
        label: 'Home',
        to: '/',
        link: '/',
        hasDropdown: false,
        dropdown: [],
        isActive: true,
        order: 1
      },
      {
        label: 'Dresses',
        to: '/dresses',
        link: '/dresses',
        hasDropdown: true,
        dropdown: categoryGroups['Dresses'],
        isActive: true,
        order: 2
      },
      {
        label: 'Sets',
        to: '/sets',
        link: '/sets',
        hasDropdown: true,
        dropdown: categoryGroups['Sets'],
        isActive: true,
        order: 3
      },
      {
        label: 'Bottoms',
        to: '/bottoms',
        link: '/bottoms',
        hasDropdown: true,
        dropdown: categoryGroups['Bottoms'],
        isActive: true,
        order: 4
      },
      {
        label: 'Kurtas',
        to: '/kurtas',
        link: '/kurtas',
        hasDropdown: true,
        dropdown: categoryGroups['Kurtas'],
        isActive: true,
        order: 5
      },
      {
        label: 'Wedding',
        to: '/wedding',
        link: '/wedding',
        hasDropdown: true,
        dropdown: categoryGroups['Wedding'],
        isActive: true,
        order: 6
      },
      {
        label: 'About',
        to: '/about',
        link: '/about',
        hasDropdown: false,
        dropdown: [],
        isActive: true,
        order: 7
      },
      {
        label: 'Gallery',
        to: '/gallery',
        link: '/gallery',
        hasDropdown: false,
        dropdown: [],
        isActive: true,
        order: 8
      },
      {
        label: 'Contact',
        to: '/contact',
        link: '/contact',
        hasDropdown: false,
        dropdown: [],
        isActive: true,
        order: 9
      }
    ];

    await Menu.insertMany(menuItems);
    
    console.log('✅ Created menu items:\n');
    menuItems.forEach(item => {
      console.log(`${item.order}. ${item.label}`);
      if (item.hasDropdown && item.dropdown.length > 0) {
        console.log(`   Subcategories: ${item.dropdown.length}`);
        item.dropdown.forEach(sub => {
          console.log(`     - ${sub.name}`);
        });
      }
      console.log('');
    });

    console.log('\n🎉 Menu setup complete!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupMenu();
