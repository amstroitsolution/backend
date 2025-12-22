const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Equipment = require('../models/Equipment');

const seedEquipment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📍 Seeding Equipment...');
    await Equipment.deleteMany({});
    await Equipment.create([
      {
        title: 'Designer Saree Collection',
        description: 'Beautiful designer sarees with premium fabric and intricate work',
        type: 'saree',
        price: 2999,
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
        isActive: true,
        order: 1
      },
      {
        title: 'Elegant Lehenga Set',
        description: 'Premium lehenga with exquisite embroidery and design',
        type: 'lehenga',
        price: 4999,
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'],
        isActive: true,
        order: 2
      },
      {
        title: 'Traditional Silk Saree',
        description: 'Pure silk saree with traditional patterns',
        type: 'saree',
        price: 3499,
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
        isActive: true,
        order: 3
      },
      {
        title: 'Bridal Lehenga Collection',
        description: 'Stunning bridal lehenga with heavy embroidery and stone work',
        type: 'lehenga',
        price: 7999,
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'],
        isActive: true,
        order: 4
      }
    ]);
    console.log('✅ Equipment seeded successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedEquipment();
