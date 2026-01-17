const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
require('dotenv').config({ path: './.env' });

const WomenProduct = require('../models/WomenProduct');
const KidsProduct = require('../models/KidsProduct');

const filePath = 'C:\\Users\\aryan\\Downloads\\yashperrr updated\\Items.xls';

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

function getCategoryFromTitle(title) {
    const upper = title.toUpperCase();
    if (upper.includes('SAREE')) return 'Saree';
    if (upper.includes('LEHENGA')) return 'Lehenga';
    if (upper.includes('DRESS')) return 'Dress';
    if (upper.includes('TOP')) return 'Top';
    if (upper.includes('KURTI')) return 'Kurti';
    if (upper.includes('KIDS')) return 'Kids';
    if (upper.includes('BOY') || upper.includes('GIRL')) return 'Kids';
    return 'General';
}

async function importData() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        const workbook = XLSX.readFile(filePath);
        const sheetName = 'Items'; // Based on inspection
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            console.error(`❌ Sheet "${sheetName}" not found in Excel`);
            process.exit(1);
        }

        const rows = XLSX.utils.sheet_to_json(worksheet);
        console.log(`📊 Processing ${rows.length} rows...`);

        let womenCount = 0;
        let kidsCount = 0;
        let updateCount = 0;

        for (const row of rows) {
            const title = row['Item Name'];
            const rate = parseFloat(row['Rate']) || 0;
            const groupName = row['Group Name'];
            const alias = row['Alias'] || '';

            if (!title) continue;

            let category = getCategoryFromTitle(title);
            if (category === 'General' && groupName && isNaN(groupName)) {
                category = groupName;
            }

            const categorySlug = slugify(category);
            const isKids = title.toUpperCase().includes('KIDS') || title.toUpperCase().includes('BOY') || title.toUpperCase().includes('GIRL');

            const Model = isKids ? KidsProduct : WomenProduct;

            const productData = {
                title: title.trim(),
                price: rate,
                category: category,
                categorySlug: categorySlug,
                description: alias,
                isActive: true
            };

            if (isKids) {
                productData.gender = title.toUpperCase().includes('BOY') ? 'Boys' : 'Girls';
            }

            // Check for existing product by title
            const existing = await Model.findOne({ title: productData.title });

            if (existing) {
                existing.price = productData.price;
                existing.category = productData.category;
                existing.categorySlug = productData.categorySlug;
                if (isKids) existing.gender = productData.gender;
                await existing.save();
                updateCount++;
            } else {
                const newProduct = new Model(productData);
                await newProduct.save();
                if (isKids) kidsCount++; else womenCount++;
            }
        }

        console.log(`\n✅ Import Complete!`);
        console.log(`✨ New Women Products: ${womenCount}`);
        console.log(`✨ New Kids Products: ${kidsCount}`);
        console.log(`🔄 Updated Products: ${updateCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

importData();
