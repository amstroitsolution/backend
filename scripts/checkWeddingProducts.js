require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const WomenProduct = require('../models/WomenProduct');

async function checkWeddingProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    
    const products = await WomenProduct.find({
      category: { $regex: 'Wedding', $options: 'i' }
    });
    
    console.log(`Wedding products: ${products.length}\n`);
    products.forEach(p => {
      console.log(`- ${p.title}`);
      console.log(`  Category: ${p.category}`);
      console.log(`  CategorySlug: ${p.categorySlug}\n`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkWeddingProducts();
