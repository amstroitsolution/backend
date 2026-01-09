const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load env
dotenv.config({ path: './.env' });

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const MONGO_URI = process.env.MONGO_URI;

const migrationMap = [
    { modelName: 'WomenProduct', collection: 'womenproducts', fields: ['images'] },
    { modelName: 'KidsProduct', collection: 'kidsproducts', fields: ['images'] },
    { modelName: 'Equipment', collection: 'equipments', fields: ['images'] },
    { modelName: 'BestSeller', collection: 'bestsellers', fields: ['image'] },
    { modelName: 'FeaturedCollection', collection: 'featuredcollections', fields: ['images'] },
    { modelName: 'Gallery', collection: 'galleries', fields: ['images', 'coverImage'] },
    { modelName: 'Hero', collection: 'heroes', fields: ['backgroundImage', 'backgroundVideo', 'mobileImage'] },
    { modelName: 'HomeService', collection: 'homeservices', fields: ['mediaUrl'] },
    { modelName: 'KidsHero', collection: 'kidsheroes', fields: ['image'] },
    { modelName: 'NewArrival', collection: 'newarrivals', fields: ['images'] },
    { modelName: 'OurValues', collection: 'ourvalues', fields: ['icon', 'sectionImage'] },
    { modelName: 'OurValuesSettings', collection: 'ourvaluessettings', fields: ['sectionImage'] },
    { modelName: 'ShopCategory', collection: 'shopcategories', fields: ['image'] },
    { modelName: 'SlowFashion', collection: 'slowfashions', fields: ['image'] },
    { modelName: 'SpecialOffer', collection: 'specialoffers', fields: ['images'] },
    { modelName: 'TrendingItem', collection: 'trendingitems', fields: ['images'] },
    { modelName: 'WatchBuy', collection: 'watchbuys', fields: ['mediaUrl', 'thumbnailUrl'] },
    { modelName: 'Work', collection: 'works', fields: ['images'] },
    { modelName: 'Service', collection: 'services', fields: ['image'] },
    { modelName: 'Testimonial', collection: 'testimonials', fields: ['image'] }
];

async function uploadToCloudinary(localPath, folder = 'migrated') {
    try {
        if (!localPath || typeof localPath !== 'string') return localPath;
        if (!localPath.startsWith('/uploads/')) return localPath;

        // Convert to absolute path
        const fullPath = path.join(process.cwd(), localPath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`  ⚠️ File not found locally: ${fullPath} (skipping)`);
            return localPath;
        }

        console.log(`  📤 Uploading: ${localPath} ...`);
        const result = await cloudinary.uploader.upload(fullPath, {
            folder: `yashper/${folder}`,
            resource_type: 'auto'
        });

        console.log(`  ✅ Success: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`  ❌ Error uploading ${localPath}:`, error.message);
        return localPath;
    }
}

async function startMigration() {
    try {
        console.log('🚀 Starting Cloudinary Migration...');
        if (!MONGO_URI) {
            console.error('❌ MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        for (const task of migrationMap) {
            console.log(`\n--- Migrating ${task.modelName} (Collection: "${task.collection}") ---`);

            const collection = mongoose.connection.db.collection(task.collection);
            const documents = await collection.find({}).toArray();

            if (documents.length === 0) {
                console.log(`  ℹ️ No documents found in "${task.collection}".`);
                continue;
            }

            console.log(`  🔍 Found ${documents.length} documents.`);

            let updatedCount = 0;
            for (const doc of documents) {
                let docUpdated = false;
                const updateFields = {};

                for (const field of task.fields) {
                    const val = doc[field];
                    if (!val) continue;

                    if (Array.isArray(val)) {
                        const newArray = [];
                        let arrayUpdated = false;
                        for (const item of val) {
                            if (item && typeof item === 'string' && item.startsWith('/uploads/')) {
                                const newUrl = await uploadToCloudinary(item, task.collection);
                                if (newUrl !== item) {
                                    newArray.push(newUrl);
                                    arrayUpdated = true;
                                } else {
                                    newArray.push(item);
                                }
                            } else {
                                newArray.push(item);
                            }
                        }
                        if (arrayUpdated) {
                            updateFields[field] = newArray;
                            docUpdated = true;
                        }
                    } else if (typeof val === 'string' && val.startsWith('/uploads/')) {
                        const newUrl = await uploadToCloudinary(val, task.collection);
                        if (newUrl !== val) {
                            updateFields[field] = newUrl;
                            docUpdated = true;
                        }
                    }
                }

                if (docUpdated) {
                    await collection.updateOne({ _id: doc._id }, { $set: updateFields });
                    console.log(`  ✨ Updated document [ID: ${doc._id}]`);
                    updatedCount++;
                }
            }
            console.log(`  🏁 Finished "${task.collection}": ${updatedCount} documents updated.`);
        }

        console.log('\n🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Primary migration error:', err);
        process.exit(1);
    }
}

startMigration();
