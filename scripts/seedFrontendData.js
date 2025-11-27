const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models (we'll create these)
const Service = require('../models/Service');
const BestSeller = require('../models/BestSeller');
const ShopCategory = require('../models/ShopCategory');
const PromoBanner = require('../models/PromoBanner');
const PromoFeature = require('../models/PromoFeature');
const TopStrip = require('../models/TopStrip');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting to seed frontend data...\n');

    // 1. Top Strip
    console.log('📍 Seeding Top Strip...');
    await TopStrip.deleteMany({});
    await TopStrip.create({
      message: 'Free Shipping on Orders Above ₹999 | Easy Returns | 24/7 Customer Support',
      isActive: true
    });
    console.log('✅ Top Strip seeded\n');

    // 2. Services
    console.log('📍 Seeding Services...');
    try {
      await Service.collection.drop();
    } catch (e) {
      // Collection might not exist
    }
    const services = [
      {
        title: 'Garments Stitching',
        description: 'Garments stitching blends fabric pieces to craft clothing. Skilled stitchers employ sewing, serging, and hemming for durability and beauty.',
        order: 1,
        isActive: true
      },
      {
        title: 'Garments Fabrication',
        description: 'Our skilled fabricators ensure that every garment is crafted with the utmost care and quality materials using modern techniques.',
        order: 2,
        isActive: true
      },
      {
        title: 'Specialized Stitching Techniques',
        description: 'From smocking and pintuck stitching to shell and blanket stitches, we offer a wide range of decorative and functional stitching options.',
        order: 3,
        isActive: true
      },
      {
        title: 'Fusing Cutting',
        description: 'Accurate cutting of fusible interfacing for seamless garment construction.',
        order: 4,
        isActive: true
      }
    ];
    await Service.insertMany(services);
    console.log('✅ Services seeded\n');

    // 3. Best Sellers
    console.log('📍 Seeding Best Sellers...');
    await BestSeller.deleteMany({});
    const bestSellers = [
      {
        title: 'Designer Lehenga',
        description: 'Exquisite designer lehenga with intricate embroidery and premium fabric',
        price: 4999,
        originalPrice: 7999,
        rating: 4.8,
        reviews: 124,
        badge: 'BESTSELLER',
        discount: '38% OFF',
        category: 'Lehenga',
        order: 1,
        isActive: true
      },
      {
        title: 'Silk Saree Collection',
        description: 'Premium silk saree collection with traditional patterns and modern appeal',
        price: 3499,
        originalPrice: 5999,
        rating: 4.9,
        reviews: 89,
        badge: 'HOT',
        discount: '42% OFF',
        category: 'Saree',
        order: 2,
        isActive: true
      },
      {
        title: 'Kids Ethnic Set',
        description: 'Adorable ethnic wear set for kids with comfortable fit and vibrant colors',
        price: 1299,
        originalPrice: 2499,
        rating: 4.7,
        reviews: 156,
        badge: 'TRENDING',
        discount: '48% OFF',
        category: 'Kids Wear',
        order: 3,
        isActive: true
      },
      {
        title: 'Bridal Collection',
        description: 'Luxurious bridal collection with heavy embellishments and royal elegance',
        price: 8999,
        originalPrice: 12999,
        rating: 5.0,
        reviews: 67,
        badge: 'PREMIUM',
        discount: '31% OFF',
        category: 'Bridal',
        order: 4,
        isActive: true
      }
    ];
    await BestSeller.insertMany(bestSellers);
    console.log('✅ Best Sellers seeded\n');

    // 4. Shop Categories
    console.log('📍 Seeding Shop Categories...');
    await ShopCategory.deleteMany({});
    const categories = [
      {
        title: "Women's Collection",
        subtitle: 'Elegant & Trendy',
        link: '/woman',
        colorGradient: 'from-pink-500 to-rose-500',
        itemsCount: '500+ Items',
        badge: 'NEW',
        order: 1,
        isActive: true
      },
      {
        title: 'Kids Fashion',
        subtitle: 'Adorable & Comfortable',
        link: '/kids',
        colorGradient: 'from-purple-500 to-pink-500',
        itemsCount: '300+ Items',
        badge: 'NEW',
        order: 2,
        isActive: true
      },
      {
        title: 'Wedding Collection',
        subtitle: 'Special Occasions',
        link: '/wedding',
        colorGradient: 'from-amber-500 to-red-500',
        itemsCount: '200+ Items',
        badge: 'NEW',
        order: 3,
        isActive: true
      },
      {
        title: 'Ethnic Wear',
        subtitle: 'Traditional Beauty',
        link: '/kurtas',
        colorGradient: 'from-green-500 to-teal-500',
        itemsCount: '400+ Items',
        badge: 'NEW',
        order: 4,
        isActive: true
      }
    ];
    await ShopCategory.insertMany(categories);
    console.log('✅ Shop Categories seeded\n');

    // 5. Promo Banner
    console.log('📍 Seeding Promo Banner...');
    await PromoBanner.deleteMany({});
    await PromoBanner.create({
      title: 'Mega Sale! Up to 50% OFF',
      description: 'Limited time offer on all collections. Don\'t miss out!',
      buttonText: 'Shop Now',
      buttonLink: '/gallery',
      discountPercentage: 50,
      order: 1,
      isActive: true
    });
    console.log('✅ Promo Banner seeded\n');

    // 6. Promo Features
    console.log('📍 Seeding Promo Features...');
    await PromoFeature.deleteMany({});
    const features = [
      {
        icon: 'FaTruck',
        title: 'Free Shipping',
        description: 'On orders above ₹999',
        colorGradient: 'from-blue-500 to-cyan-500',
        order: 1,
        isActive: true
      },
      {
        icon: 'FaUndo',
        title: 'Easy Returns',
        description: '7 days return policy',
        colorGradient: 'from-green-500 to-emerald-500',
        order: 2,
        isActive: true
      },
      {
        icon: 'FaShieldAlt',
        title: 'Secure Payment',
        description: '100% secure transactions',
        colorGradient: 'from-purple-500 to-pink-500',
        order: 3,
        isActive: true
      },
      {
        icon: 'FaGift',
        title: 'Special Offers',
        description: 'Exclusive deals daily',
        colorGradient: 'from-amber-500 to-red-500',
        order: 4,
        isActive: true
      }
    ];
    await PromoFeature.insertMany(features);
    console.log('✅ Promo Features seeded\n');

    console.log('🎉 All frontend data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Top Strip: 1 item`);
    console.log(`   - Services: ${services.length} items`);
    console.log(`   - Best Sellers: ${bestSellers.length} items`);
    console.log(`   - Shop Categories: ${categories.length} items`);
    console.log(`   - Promo Banner: 1 item`);
    console.log(`   - Promo Features: ${features.length} items`);
    console.log('\n✅ You can now use the admin panel to manage all this data!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

// Run the seeder
const run = async () => {
  await connectDB();
  await seedData();
};

run();
