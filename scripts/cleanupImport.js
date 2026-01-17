const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const WomenProduct = require('../models/WomenProduct');
const KidsProduct = require('../models/KidsProduct');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Identifying products added in the previous import:
        // They have no images and a non-empty description (alias)
        // Or we can just use the titles we know were imported if we want to be very precise.
        // However, the user said "remove whatever you have added".

        // A safer way is to check the timestamp if they were added recently, 
        // but filtering by empty images and having a description is a good proxy for this specific case.

        const woResult = await WomenProduct.deleteMany({ images: { $size: 0 }, description: { $ne: '' } });
        const kiResult = await KidsProduct.deleteMany({ images: { $size: 0 }, description: { $ne: '' } });

        console.log(`🗑️ Deleted ${woResult.deletedCount} Women Products`);
        console.log(`🗑️ Deleted ${kiResult.deletedCount} Kids Products`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

cleanup();
