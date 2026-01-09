// Seed lehenga and saree data for local development
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// Import the WomenProduct model
const WomenProduct = require('./models/WomenProduct');

async function seedLehengaSareeData() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Sample Lehenga Data
    const lehengaData = [
      {
        title: "Royal Red Bridal Lehenga",
        description: "Stunning red bridal lehenga with heavy gold embroidery and zari work. Perfect for weddings and special occasions.",
        price: 45999,
        originalPrice: 55999,
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Bridal Lehengas",
        subCategory: "Bridal Lehengas",
        tags: ["bridal", "wedding", "red", "embroidery", "zari"],
        colors: ["Red", "Gold"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        fabric: "Silk",
        occasion: "Wedding",
        isActive: true,
        isFeatured: true,
        stock: 10
      },
      {
        title: "Pink Party Wear Lehenga",
        description: "Beautiful pink lehenga with floral embroidery, perfect for parties and celebrations.",
        price: 28999,
        originalPrice: 35999,
        images: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Party Wear Lehengas",
        subCategory: "Party Wear Lehengas",
        tags: ["party", "pink", "floral", "embroidery"],
        colors: ["Pink", "Gold"],
        sizes: ["S", "M", "L", "XL"],
        fabric: "Georgette",
        occasion: "Party",
        isActive: true,
        isFeatured: true,
        stock: 15
      },
      {
        title: "Golden Designer Lehenga",
        description: "Elegant golden lehenga with intricate mirror work and sequins.",
        price: 52999,
        originalPrice: 62999,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Bridal Lehengas",
        subCategory: "Designer Lehengas",
        tags: ["designer", "golden", "mirror work", "sequins"],
        colors: ["Gold", "Cream"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        fabric: "Net",
        occasion: "Wedding",
        isActive: true,
        isFeatured: true,
        stock: 8
      },
      {
        title: "Maroon Velvet Lehenga",
        description: "Rich maroon velvet lehenga with gold embellishments and traditional motifs.",
        price: 38999,
        originalPrice: 45999,
        images: ["https://images.unsplash.com/photo-1583391733981-24c4ec8d8d4f?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Bridal Lehengas",
        subCategory: "Velvet Lehengas",
        tags: ["velvet", "maroon", "traditional", "embellishments"],
        colors: ["Maroon", "Gold"],
        sizes: ["S", "M", "L", "XL"],
        fabric: "Velvet",
        occasion: "Wedding",
        isActive: true,
        isFeatured: true,
        stock: 12
      }
    ];

    // Sample Saree Data
    const sareeData = [
      {
        title: "Banarasi Silk Saree",
        description: "Traditional Banarasi silk saree with gold zari work and intricate patterns.",
        price: 18999,
        originalPrice: 24999,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Silk Sarees",
        subCategory: "Silk Sarees",
        tags: ["banarasi", "silk", "zari", "traditional"],
        colors: ["Red", "Gold"],
        sizes: ["Free Size"],
        fabric: "Silk",
        occasion: "Wedding",
        isActive: true,
        isFeatured: true,
        stock: 20
      },
      {
        title: "Designer Georgette Saree",
        description: "Elegant georgette saree with contemporary design and beautiful draping.",
        price: 12999,
        originalPrice: 16999,
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Designer Sarees",
        subCategory: "Designer Sarees",
        tags: ["designer", "georgette", "contemporary", "elegant"],
        colors: ["Blue", "Silver"],
        sizes: ["Free Size"],
        fabric: "Georgette",
        occasion: "Party",
        isActive: true,
        isFeatured: true,
        stock: 25
      },
      {
        title: "Cotton Handloom Saree",
        description: "Pure cotton handloom saree with traditional motifs and comfortable wear.",
        price: 8999,
        originalPrice: 11999,
        images: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Cotton Sarees",
        subCategory: "Cotton Sarees",
        tags: ["cotton", "handloom", "traditional", "comfortable"],
        colors: ["Green", "Gold"],
        sizes: ["Free Size"],
        fabric: "Cotton",
        occasion: "Casual",
        isActive: true,
        isFeatured: true,
        stock: 30
      },
      {
        title: "Kanjivaram Silk Saree",
        description: "Authentic Kanjivaram silk saree with temple border and rich colors.",
        price: 25999,
        originalPrice: 32999,
        images: ["https://images.unsplash.com/photo-1583391733981-24c4ec8d8d4f?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Silk Sarees",
        subCategory: "Kanjivaram Sarees",
        tags: ["kanjivaram", "silk", "temple border", "authentic"],
        colors: ["Purple", "Gold"],
        sizes: ["Free Size"],
        fabric: "Silk",
        occasion: "Wedding",
        isActive: true,
        isFeatured: true,
        stock: 15
      },
      {
        title: "Chiffon Party Saree",
        description: "Light and elegant chiffon saree perfect for parties and evening events.",
        price: 9999,
        originalPrice: 13999,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Designer Sarees",
        subCategory: "Party Sarees",
        tags: ["chiffon", "party", "light", "elegant"],
        colors: ["Pink", "Silver"],
        sizes: ["Free Size"],
        fabric: "Chiffon",
        occasion: "Party",
        isActive: true,
        isFeatured: true,
        stock: 22
      },
      {
        title: "Embroidered Net Saree",
        description: "Beautiful net saree with intricate embroidery and modern appeal.",
        price: 15999,
        originalPrice: 19999,
        images: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=800&q=80"],
        category: "Wedding → Designer Sarees",
        subCategory: "Net Sarees",
        tags: ["net", "embroidery", "modern", "beautiful"],
        colors: ["Black", "Gold"],
        sizes: ["Free Size"],
        fabric: "Net",
        occasion: "Party",
        isActive: true,
        isFeatured: true,
        stock: 18
      }
    ];

    // Combine all data
    const allProducts = [...lehengaData, ...sareeData];

    // Clear existing products in these categories (optional)
    console.log('🗑️ Clearing existing lehenga and saree products...');
    await WomenProduct.deleteMany({
      category: {
        $in: [
          'Wedding → Bridal Lehengas',
          'Wedding → Party Wear Lehengas',
          'Wedding → Silk Sarees',
          'Wedding → Designer Sarees',
          'Wedding → Cotton Sarees'
        ]
      }
    });

    // Insert new products
    console.log('📦 Inserting new lehenga and saree products...');
    const insertedProducts = await WomenProduct.insertMany(allProducts);
    
    console.log(`✅ Successfully inserted ${insertedProducts.length} products:`);
    console.log(`   - ${lehengaData.length} Lehengas`);
    console.log(`   - ${sareeData.length} Sarees`);

    console.log('\n🎉 Lehenga and Saree data seeded successfully!');
    console.log('\n💡 Now you can:');
    console.log('1. Refresh your home page at http://localhost:5173');
    console.log('2. Check the new Lehenga and Saree sections');
    console.log('3. Test the inquiry forms');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding lehenga and saree data:', error);
    process.exit(1);
  }
}

seedLehengaSareeData();