const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Hero = require('../models/Hero');
const TrendingItem = require('../models/TrendingItem');
const NewArrival = require('../models/NewArrival');
const OurValues = require('../models/OurValues');
const SlowFashion = require('../models/SlowFashion');
const Testimonial = require('../models/Testimonial');

const seedEssentialData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Seed Hero
    console.log('📍 Seeding Hero...');
    await Hero.deleteMany({});
    await Hero.create([
      {
        title: 'Welcome to Yashper',
        subtitle: 'Discover Your Style',
        description: 'Explore our latest collection of elegant dresses',
        backgroundImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920',
        ctaText: 'Shop Now',
        ctaLink: '/dresses',
        isActive: true,
        order: 1,
        altText: 'Welcome to Yashper - Fashion Collection'
      }
    ]);
    console.log('✅ Hero seeded\n');

    // Seed Trending Items
    console.log('📍 Seeding Trending Items...');
    await TrendingItem.deleteMany({});
    await TrendingItem.create([
      {
        title: 'Elegant Gown',
        subtitle: 'Evening Collection',
        description: 'Beautiful evening gown',
        images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600'],
        price: 2999,
        category: 'gown-and-dresses',
        badge: 'TRENDING',
        link: '/dresses/gown-and-dresses',
        isActive: true,
        order: 1
      },
      {
        title: 'Designer Saree',
        subtitle: 'Traditional Wear',
        description: 'Traditional designer saree',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
        price: 3499,
        category: 'insta-sarees',
        badge: 'HOT',
        link: '/dresses/insta-sarees',
        isActive: true,
        order: 2
      }
    ]);
    console.log('✅ Trending Items seeded\n');

    // Seed New Arrivals
    console.log('📍 Seeding New Arrivals...');
    await NewArrival.deleteMany({});
    await NewArrival.create([
      {
        title: 'Latest Lehenga',
        subtitle: 'New Collection',
        description: 'New arrival lehenga collection',
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'],
        price: 4999,
        category: 'lehenga',
        badge: 'NEW',
        link: '/dresses/lehenga',
        isActive: true,
        order: 1
      }
    ]);
    console.log('✅ New Arrivals seeded\n');

    // Seed Our Values
    console.log('📍 Seeding Our Values...');
    await OurValues.deleteMany({});
    await OurValues.create([
      {
        title: 'Quality First',
        description: 'We ensure the highest quality in every piece',
        emoji: '✨',
        order: 1,
        isActive: true
      },
      {
        title: 'Customer Satisfaction',
        description: 'Your happiness is our priority',
        emoji: '❤️',
        order: 2,
        isActive: true
      }
    ]);
    console.log('✅ Our Values seeded\n');

    // Seed Slow Fashion
    console.log('📍 Seeding Slow Fashion...');
    await SlowFashion.deleteMany({});
    await SlowFashion.create([
      {
        title: 'Sustainable Fashion',
        description: 'We believe in sustainable and ethical fashion practices',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
        category: 'Fashion',
        buttonText: 'Learn More',
        buttonLink: '/about',
        order: 1,
        isActive: true
      }
    ]);
    console.log('✅ Slow Fashion seeded\n');

    // Seed Testimonials
    console.log('📍 Seeding Testimonials...');
    await Testimonial.deleteMany({});
    await Testimonial.create([
      {
        name: 'Sarah Johnson',
        role: 'Fashion Enthusiast',
        quote: 'Amazing quality and beautiful designs! Highly recommended.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        isActive: true,
        order: 1
      },
      {
        name: 'Priya Sharma',
        role: 'Regular Customer',
        quote: 'Love the collection! Great customer service.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        isActive: true,
        order: 2
      }
    ]);
    console.log('✅ Testimonials seeded\n');

    console.log('🎉 All essential data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedEssentialData();
