const mongoose = require('mongoose');
require('dotenv').config();

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const WomenProduct = require('./models/WomenProduct');

    // Get all unique categories
    const categories = await WomenProduct.distinct('category');
    console.log('📦 All Categories in Database:');
    console.log('================================');
    categories.forEach(cat => console.log(`  - "${cat}"`));
    console.log('');

    // Check specific categories
    const searchTerms = [
      'Trouser & Pants',
      'Salwar & Leggings',
      'Palazzos & Culottes',
      '2 Pcs Kurta Sets',
      '3 Pcs Kurta Sets',
      'A-Line Kurta',
      'Party Wear Lehengas'
    ];

    console.log('🔍 Searching for specific categories:');
    console.log('=====================================');
    
    for (const term of searchTerms) {
      // Exact match
      const exactCount = await WomenProduct.countDocuments({ category: term });
      
      // Partial match (contains)
      const partialCount = await WomenProduct.countDocuments({ 
        category: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
      });
      
      console.log(`\n"${term}":`);
      console.log(`  Exact match: ${exactCount} products`);
      console.log(`  Partial match: ${partialCount} products`);
      
      if (partialCount > 0) {
        const sample = await WomenProduct.findOne({ 
          category: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
        }).select('title category isActive');
        console.log(`  Sample: "${sample.title}"`);
        console.log(`  Category: "${sample.category}"`);
        console.log(`  Active: ${sample.isActive}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCategories();
