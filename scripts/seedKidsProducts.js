const mongoose = require('mongoose');
const path = require('path');
const KidsProduct = require('../models/KidsProduct');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sampleKidsProducts = [
  // Girls Products
  {
    title: "Girls Floral Dress",
    description: "Beautiful floral print dress perfect for parties and special occasions",
    gender: "Girls",
    category: "Dresses & Gowns",
    categorySlug: "dresses-gowns",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    colors: ["Pink", "Blue", "Yellow"],
    material: "Cotton Blend",
    ageGroup: "2-4 years",
    stock: 50,
    badge: "SALE",
    featured: true,
    isActive: true,
    order: 1,
    tags: ["party wear", "floral", "summer"]
  },
  {
    title: "Girls Ethnic Lehenga Set",
    description: "Traditional lehenga choli set with dupatta for festive occasions",
    gender: "Girls",
    category: "Ethnic Wear",
    categorySlug: "ethnic-wear",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    sizes: ["4-5Y", "5-6Y", "6-7Y", "7-8Y"],
    colors: ["Red", "Pink", "Golden"],
    material: "Silk Blend",
    ageGroup: "4-6 years",
    stock: 30,
    badge: "HOT",
    featured: true,
    isActive: true,
    order: 2,
    tags: ["ethnic", "festive", "wedding"]
  },
  {
    title: "Girls Party Gown",
    description: "Elegant party gown with sequin work and bow detail",
    gender: "Girls",
    category: "Dresses & Gowns",
    price: 1899,
    sizes: ["3-4Y", "4-5Y", "5-6Y", "6-7Y"],
    colors: ["Purple", "Pink", "White"],
    ageGroup: "4-6 years",
    featured: true,
    isActive: true,
    order: 3
  },
  {
    title: "Girls Kurti with Palazzo",
    description: "Comfortable cotton kurti with matching palazzo pants",
    gender: "Girls",
    category: "Ethnic Wear",
    price: 999,
    sizes: ["4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y"],
    colors: ["Blue", "Pink", "Yellow", "Green"],
    ageGroup: "6-8 years",
    featured: false,
    isActive: true,
    order: 4
  },
  {
    title: "Girls Denim Dress",
    description: "Trendy denim dress with embroidered details",
    gender: "Girls",
    category: "Dresses & Gowns",
    price: 1499,
    sizes: ["5-6Y", "6-7Y", "7-8Y", "8-9Y"],
    colors: ["Blue", "Light Blue"],
    ageGroup: "6-8 years",
    featured: false,
    isActive: true,
    order: 5
  },
  {
    title: "Girls Anarkali Suit",
    description: "Beautiful anarkali suit with dupatta for special occasions",
    gender: "Girls",
    category: "Ethnic Wear",
    price: 2199,
    sizes: ["6-7Y", "7-8Y", "8-9Y", "9-10Y"],
    colors: ["Pink", "Peach", "Mint Green"],
    ageGroup: "8-10 years",
    featured: true,
    isActive: true,
    order: 6
  },

  // Boys Products
  {
    title: "Boys Kurta Pajama Set",
    description: "Traditional kurta pajama set perfect for festivals and weddings",
    gender: "Boys",
    category: "Ethnic Wear",
    price: 1599,
    sizes: ["4-5Y", "5-6Y", "6-7Y", "7-8Y"],
    colors: ["White", "Cream", "Blue"],
    ageGroup: "4-6 years",
    featured: true,
    isActive: true,
    order: 1
  },
  {
    title: "Boys Sherwani Set",
    description: "Designer sherwani with churidar for special occasions",
    gender: "Boys",
    category: "Ethnic Wear",
    price: 2999,
    sizes: ["5-6Y", "6-7Y", "7-8Y", "8-9Y"],
    colors: ["Golden", "Maroon", "Navy Blue"],
    ageGroup: "6-8 years",
    featured: true,
    isActive: true,
    order: 2
  },
  {
    title: "Boys Casual Shirt & Jeans",
    description: "Stylish casual shirt with matching denim jeans",
    gender: "Boys",
    category: "Casual Wear",
    price: 1299,
    sizes: ["4-5Y", "5-6Y", "6-7Y", "7-8Y", "8-9Y"],
    colors: ["Blue", "White", "Black"],
    ageGroup: "6-8 years",
    featured: false,
    isActive: true,
    order: 3
  },
  {
    title: "Boys Nehru Jacket Set",
    description: "Trendy Nehru jacket with kurta and pajama",
    gender: "Boys",
    category: "Ethnic Wear",
    price: 2299,
    sizes: ["6-7Y", "7-8Y", "8-9Y", "9-10Y"],
    colors: ["Black", "Navy", "Maroon"],
    ageGroup: "8-10 years",
    featured: true,
    isActive: true,
    order: 4
  },
  {
    title: "Baby Boy Romper Set",
    description: "Cute romper set for babies with soft cotton fabric",
    gender: "Boys",
    category: "Baby Essentials",
    price: 699,
    sizes: ["0-3M", "3-6M", "6-9M", "9-12M"],
    colors: ["Blue", "Green", "Yellow"],
    ageGroup: "0-2 years",
    featured: false,
    isActive: true,
    order: 5
  },
  {
    title: "Boys T-Shirt & Shorts Combo",
    description: "Comfortable cotton t-shirt with matching shorts",
    gender: "Boys",
    category: "Casual Wear",
    price: 899,
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    colors: ["Red", "Blue", "Green", "Yellow"],
    ageGroup: "2-4 years",
    featured: false,
    isActive: true,
    order: 6
  }
];

async function seedKidsProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing kids products
    await KidsProduct.deleteMany({});
    console.log('🗑️  Cleared existing kids products');

    // Insert sample products
    const products = await KidsProduct.insertMany(sampleKidsProducts);
    console.log(`✅ Added ${products.length} kids products`);

    console.log('\n📦 Sample Products Added:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} (${product.gender} - ${product.category}) - ₹${product.price}`);
    });

    console.log('\n✨ Kids products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding kids products:', error);
    process.exit(1);
  }
}

seedKidsProducts();
