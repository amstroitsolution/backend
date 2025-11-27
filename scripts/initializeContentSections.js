const mongoose = require('mongoose');
const OurValues = require('../models/OurValues');
const SlowFashion = require('../models/SlowFashion');

async function initializeContentSections() {
  try {
    console.log('🚀 Initializing Content Sections...');

    // Check if Our Values exist
    const valuesCount = await OurValues.countDocuments();
    console.log(`📊 Current Our Values count: ${valuesCount}`);

    if (valuesCount === 0) {
      console.log('📊 Creating sample Our Values...');
      const sampleValues = [
        {
          title: 'Innovation',
          description: 'We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.',
          emoji: '💡',
          order: 1,
          isActive: true
        },
        {
          title: 'Quality',
          description: 'Excellence is not just a goal, it\'s our standard. We deliver only the highest quality products and services.',
          emoji: '⭐',
          order: 2,
          isActive: true
        },
        {
          title: 'Sustainability',
          description: 'We are committed to environmental responsibility and sustainable business practices.',
          emoji: '🌱',
          order: 3,
          isActive: true
        },
        {
          title: 'Customer Focus',
          description: 'Our customers are at the heart of everything we do. We listen, understand, and deliver exceptional experiences.',
          emoji: '🎯',
          order: 4,
          isActive: true
        }
      ];

      await OurValues.insertMany(sampleValues);
      console.log('✅ Sample Our Values created successfully!');
    }

    // Check if Slow Fashion items exist
    const fashionCount = await SlowFashion.countDocuments();
    console.log(`👗 Current Slow Fashion count: ${fashionCount}`);

    if (fashionCount === 0) {
      console.log('👗 Creating sample Slow Fashion items...');
      const sampleItems = [
        {
          title: 'Sustainable Cotton Collection',
          description: 'Discover our eco-friendly cotton pieces made from 100% organic materials. Perfect for conscious consumers who care about the environment.',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
          category: 'Sustainable Fashion',
          buttonText: 'Shop Now',
          buttonLink: '#sustainable-collection',
          tags: ['organic', 'cotton', 'sustainable', 'eco-friendly'],
          order: 1,
          isActive: true
        },
        {
          title: 'Vintage Revival Trends',
          description: 'Embrace timeless style with our curated vintage-inspired pieces that never go out of fashion. Classic designs with modern comfort.',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
          category: 'Vintage',
          buttonText: 'Explore Collection',
          buttonLink: '#vintage-collection',
          tags: ['vintage', 'timeless', 'classic', 'retro'],
          order: 2,
          isActive: true
        },
        {
          title: 'Ethical Manufacturing',
          description: 'Learn about our commitment to fair trade and ethical manufacturing processes. Every piece tells a story of responsible production.',
          image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop',
          category: 'Ethics',
          buttonText: 'Learn More',
          buttonLink: '#ethical-manufacturing',
          tags: ['ethical', 'fair-trade', 'manufacturing', 'responsible'],
          order: 3,
          isActive: true
        },
        {
          title: 'Minimalist Wardrobe Essentials',
          description: 'Build a capsule wardrobe with our carefully selected essentials. Quality pieces that mix and match effortlessly.',
          image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop',
          category: 'Minimalist',
          buttonText: 'Build Wardrobe',
          buttonLink: '#minimalist-essentials',
          tags: ['minimalist', 'capsule', 'essentials', 'versatile'],
          order: 4,
          isActive: true
        }
      ];

      await SlowFashion.insertMany(sampleItems);
      console.log('✅ Sample Slow Fashion items created successfully!');
    }

    console.log('🎉 Content sections initialization completed!');
    return {
      ourValuesCount: await OurValues.countDocuments(),
      slowFashionCount: await SlowFashion.countDocuments()
    };

  } catch (error) {
    console.error('❌ Error initializing content sections:', error);
    throw error;
  }
}

module.exports = initializeContentSections;