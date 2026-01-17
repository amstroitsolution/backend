const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const WomenProduct = require('../models/WomenProduct');
const KidsProduct = require('../models/KidsProduct');

async function wipeData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const woResult = await WomenProduct.deleteMany({});
        const kiResult = await KidsProduct.deleteMany({});

        console.log(`🗑️ Wiped ${woResult.deletedCount} Women Products`);
        console.log(`🗑️ Wiped ${kiResult.deletedCount} Kids Products`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during wipe:', err);
        process.exit(1);
    }
}

wipeData();
