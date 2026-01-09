// Script to check all product categories in database
const mongoose = require('mongoose');
require('dotenv').config();

// Define WomenProduct schema inline
const womenProductSchema = new mongoose.Schema({
  category: String,
  title: String
}, { collection: 'womenproducts' });

const WomenProduct = mongoose.model('WomenProduct', womenProductSchema);

async function checkCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await WomenProduct.find({});
    console.log(`📦 Total Products: ${products.length}\n`);

    // Get unique categories
    const categories = {};
    products.forEach(product => {
      if (product.category) {
        if (!categories[product.category]) {
          categories[product.category] = 0;
        }
        categories[product.category]++;
      }
    });

    console.log('📋 All Categories in Database:\n');
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1]) // Sort by count
      .forEach(([category, count]) => {
        console.log(`  ${category.padEnd(40)} → ${count} products`);
      });

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`  Total unique categories: ${Object.keys(categories).length}`);
    console.log('='.repeat(60));

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCategories();
