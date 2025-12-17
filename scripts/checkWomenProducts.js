require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const WomenProduct = require('../models/WomenProduct');

async function checkProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all products
    const products = await WomenProduct.find({});
    console.log(`\n📦 Total products in database: ${products.length}\n`);

    if (products.length === 0) {
      console.log('❌ No products found in database!');
    } else {
      console.log('Products:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.title}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   CategorySlug: ${product.categorySlug}`);
        console.log(`   Active: ${product.isActive}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
