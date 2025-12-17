require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

async function checkMenus() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    const menus = await MenuItem.find({});
    console.log('Menus:');
    menus.forEach(m => console.log(`- ${m.label}`));
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkMenus();
