const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: './.env' });

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in .env file!');
      console.log('Please check backend/.env file');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'rajanpbh03@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   ID:', existingAdmin._id);
      
      // Update password if needed
      const updatePassword = process.argv[2];
      if (updatePassword) {
        existingAdmin.password = updatePassword;
        await existingAdmin.save();
        console.log('✅ Password updated successfully!');
      }
    } else {
      // Create new admin
      const newAdmin = new Admin({
        name: 'Rajan',
        email: 'rajanpbh03@gmail.com',
        password: 'admin123' // Change this!
      });
      
      await newAdmin.save();
      console.log('✅ Admin created successfully!');
      console.log('   Email:', newAdmin.email);
      console.log('   Password: admin123 (CHANGE THIS!)');
      console.log('   ID:', newAdmin._id);
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
