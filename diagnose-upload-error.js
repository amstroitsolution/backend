require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');

console.log('\n🔍 DIAGNOSING UPLOAD ERROR\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('  CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? '✅ Set' : '❌ Missing');
console.log('  CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || '❌ Missing');
console.log('  CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY || '❌ Missing');
console.log('  CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set (hidden)' : '❌ Missing');

// Check Cloudinary config
console.log('\n⚙️  Cloudinary Configuration:');
try {
  const config = cloudinary.config();
  console.log('  Cloud Name:', config.cloud_name || '❌ Not configured');
  console.log('  API Key:', config.api_key || '❌ Not configured');
  console.log('  API Secret:', config.api_secret ? '✅ Configured' : '❌ Not configured');
} catch (error) {
  console.log('  ❌ Error reading config:', error.message);
}

// Test Cloudinary connection
console.log('\n🌐 Testing Cloudinary Connection:');
cloudinary.api.ping()
  .then(() => {
    console.log('  ✅ Connection successful!');
    console.log('\n✅ Cloudinary is working correctly!');
    console.log('\nIf you still get errors, check:');
    console.log('  1. Backend server was restarted after .env changes');
    console.log('  2. File size is not too large (< 10MB)');
    console.log('  3. File format is supported (jpg, png, etc.)');
  })
  .catch(err => {
    console.log('  ❌ Connection failed!');
    console.log('  Error:', err.message);
    console.log('\n❌ Cloudinary is NOT working!');
    console.log('\nPossible issues:');
    console.log('  1. Invalid credentials in .env file');
    console.log('  2. Network/firewall blocking Cloudinary');
    console.log('  3. Cloudinary account issue');
  });
