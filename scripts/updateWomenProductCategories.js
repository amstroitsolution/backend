require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const WomenProduct = require('../models/WomenProduct');

// Category mapping: old category name -> new category name and slug
const categoryMapping = {
  // Dresses group
  'Gown & Dresses': { category: 'Dresses → Gown and Dresses', slug: 'dresses/gown-and-dresses' },
  'Jumpsuits': { category: 'Dresses → Jumpsuits', slug: 'dresses/jumpsuits' },
  
  // Sets group
  'Coord Sets': { category: 'Sets → Coord Sets', slug: 'sets/coord-sets' },
  '2 Pcs Kurta Sets': { category: 'Sets → 2 Pcs Kurta Sets', slug: 'sets/2pcs-kurta-sets' },
  '3 Pcs Kurta Sets': { category: 'Sets → 3 Pcs Kurta Sets', slug: 'sets/3pcs-kurta-sets' },
  'Anarkali Sets': { category: 'Sets → Anarkali Sets', slug: 'sets/anarkali-sets' },
  'A-Line Sets': { category: 'Sets → A-Line Sets', slug: 'sets/a-line-sets' },
  'Straight Suit Sets': { category: 'Sets → Straight Suit Sets', slug: 'sets/straight-suit-sets' },
  'Sharara Sets': { category: 'Sets → Sharara Sets', slug: 'sets/sharara-sets' },
  'Plus Size Suit Sets': { category: 'Sets → Plus Size Suit Sets', slug: 'sets/plus-size-suit-sets' },
  
  // Bottoms group
  'Trouser & Pants': { category: 'Bottoms → Trouser & Pants', slug: 'bottoms/trouser-pants' },
  'Salwar & Leggings': { category: 'Bottoms → Salwar & Leggings', slug: 'bottoms/salwar-leggings' },
  'Palazzos & Culottes': { category: 'Bottoms → Palazzos & Culottes', slug: 'bottoms/palazzos-culottes' },
  'Skirts': { category: 'Bottoms → Skirts', slug: 'bottoms/skirts' },
  'Jeggings': { category: 'Bottoms → Jeggings', slug: 'bottoms/jeggings' },
  'Plus Size Bottoms': { category: 'Bottoms → Plus Size Bottoms', slug: 'bottoms/plus-size-bottoms' },
  
  // Kurtas group
  'Straight Kurtas': { category: 'Kurtas → Straight Kurtas', slug: 'kurtas/straight-kurtas' },
  'Flared Kurtas': { category: 'Kurtas → Flared Kurtas', slug: 'kurtas/flared-kurtas' },
  'Asymmetrical Kurta': { category: 'Kurtas → Asymmetrical Kurta', slug: 'kurtas/asymmetrical-kurta' },
  'Winter Kurta': { category: 'Kurtas → Winter Kurta', slug: 'kurtas/winter-kurta' },
  'Plus Size Kurta': { category: 'Kurtas → Plus Size Kurta', slug: 'kurtas/plus-size-kurta' },
  'A-Line Kurta': { category: 'Kurtas → A-Line Kurta', slug: 'kurtas/a-line-kurta' },
  
  // Wedding group (if you have these)
  'Bridal Lehengas': { category: 'Wedding → Bridal Lehengas', slug: 'wedding/bridal-lehengas' },
  'Silk Sarees': { category: 'Wedding → Silk Sarees', slug: 'wedding/silk-sarees' },
  'Cotton Sarees': { category: 'Wedding → Cotton Sarees', slug: 'wedding/cotton-sarees' },
};

async function updateProductCategories() {
  try {
    console.log('🔄 Starting category update...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await WomenProduct.find({});
    console.log(`📦 Found ${products.length} products\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      const oldCategory = product.category;
      
      // Check if this category needs updating
      if (categoryMapping[oldCategory]) {
        const newData = categoryMapping[oldCategory];
        
        try {
          await WomenProduct.findByIdAndUpdate(product._id, {
            category: newData.category,
            categorySlug: newData.slug
          });
          
          console.log(`✅ Updated: "${oldCategory}" → "${newData.category}"`);
          console.log(`   Product: ${product.title}`);
          console.log(`   Slug: ${newData.slug}\n`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Error updating product "${product.title}":`, error.message);
          errorCount++;
        }
      } else {
        console.log(`⏭️  Skipped: "${oldCategory}" (no mapping found)`);
        console.log(`   Product: ${product.title}\n`);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount} products`);
    console.log(`   ⏭️  Skipped: ${skippedCount} products`);
    console.log(`   ❌ Errors: ${errorCount} products`);
    console.log('='.repeat(50) + '\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    console.log('\n🎉 Category update completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProductCategories();
