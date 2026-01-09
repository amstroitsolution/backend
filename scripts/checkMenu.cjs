// Check existing menu items
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

async function checkMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const menus = await Menu.find({}).sort({ order: 1 });
    
    console.log(`📋 Found ${menus.length} menu items:\n`);
    
    menus.forEach(menu => {
      console.log(`${menu.order}. ${menu.label}`);
      console.log(`   to: ${menu.to}`);
      console.log(`   hasDropdown: ${menu.hasDropdown}`);
      console.log(`   dropdown items: ${menu.dropdown?.length || 0}`);
      console.log(`   isActive: ${menu.isActive}`);
      console.log('');
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMenu();
