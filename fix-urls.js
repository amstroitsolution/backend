const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import all models that might have image URLs
const WomenProduct = require('./models/WomenProduct');
const KidsProduct = require('./models/KidsProduct');
const Hero = require('./models/Hero');
const TrendingItem = require('./models/TrendingItem');
const NewArrival = require('./models/NewArrival');

const fixLocalhostUrls = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI not found in environment variables');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const SEARCH_URL = 'http://localhost:5000';
        const PRODUCTION_URL = 'https://api.yashper.com';
        let totalFixed = 0;

        const fixUrl = (url) => {
            if (!url) return url;
            if (url.includes('localhost:5000')) {
                return url.replace('http://localhost:5000', PRODUCTION_URL);
            }
            return url;
        };

        // Fix Women Products
        console.log('📍 Fixing Women Products...');
        const womenProducts = await WomenProduct.find({});
        for (const product of womenProducts) {
            let updated = false;
            if (product.images && Array.isArray(product.images)) {
                const newImages = product.images.map(img => {
                    const fixed = fixUrl(img);
                    if (fixed !== img) updated = true;
                    return fixed;
                });
                if (updated) product.images = newImages;
            }
            if (updated) {
                await product.save();
                totalFixed++;
            }
        }
        console.log(`✅ Fixed ${totalFixed} women products\n`);

        // Fix Kids Products
        console.log('📍 Fixing Kids Products...');
        totalFixed = 0;
        const kidsProducts = await KidsProduct.find({});
        for (const product of kidsProducts) {
            let updated = false;
            if (product.images && Array.isArray(product.images)) {
                const newImages = product.images.map(img => {
                    const fixed = fixUrl(img);
                    if (fixed !== img) updated = true;
                    return fixed;
                });
                if (updated) product.images = newImages;
            }
            if (updated) {
                await product.save();
                totalFixed++;
            }
        }
        console.log(`✅ Fixed ${totalFixed} kids products\n`);

        // Fix Hero
        console.log('📍 Fixing Hero slides...');
        totalFixed = 0;
        const heroes = await Hero.find({});
        for (const hero of heroes) {
            const fixed = fixUrl(hero.backgroundImage);
            if (fixed !== hero.backgroundImage) {
                hero.backgroundImage = fixed;
                await hero.save();
                totalFixed++;
            }
        }
        console.log(`✅ Fixed ${totalFixed} hero slides\n`);

        // Fix Trending Items
        console.log('📍 Fixing Trending Items...');
        totalFixed = 0;
        const trending = await TrendingItem.find({});
        for (const item of trending) {
            let updated = false;
            if (item.images && Array.isArray(item.images)) {
                const newImages = item.images.map(img => {
                    const fixed = fixUrl(img);
                    if (fixed !== img) updated = true;
                    return fixed;
                });
                if (updated) item.images = newImages;
            }
            if (updated) {
                await item.save();
                totalFixed++;
            }
        }
        console.log(`✅ Fixed ${totalFixed} trending items\n`);

        // Fix New Arrivals
        console.log('📍 Fixing New Arrivals...');
        totalFixed = 0;
        const arrivals = await NewArrival.find({});
        for (const item of arrivals) {
            let updated = false;
            if (item.images && Array.isArray(item.images)) {
                const newImages = item.images.map(img => {
                    const fixed = fixUrl(img);
                    if (fixed !== img) updated = true;
                    return fixed;
                });
                if (updated) item.images = newImages;
            }
            if (updated) {
                await item.save();
                totalFixed++;
            }
        }
        console.log(`✅ Fixed ${totalFixed} new arrivals\n`);

        console.log('🎉 All localhost URLs fixed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixLocalhostUrls();
