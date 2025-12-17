const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const WomenProduct = require('../models/WomenProduct');

const cleanOldProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing women products
    const result = await WomenProduct.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} old products`);

    console.log('\n✅ Database cleaned!');
    console.log('Now you can add new products with correct category slugs.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanOldProducts();
