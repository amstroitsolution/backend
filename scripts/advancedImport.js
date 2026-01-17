const mongoose = require('mongoose');
const XLSX = require('xlsx');
require('dotenv').config({ path: './.env' });

const WomenProduct = require('../models/WomenProduct');
const KidsProduct = require('../models/KidsProduct');
const SubMenuItem = require('../models/SubMenuItem');

const filePath = 'C:\\Users\\aryan\\Downloads\\yashperrr updated\\Items.xls';

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

async function advancedImport() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Fetch all subcategories for mapping
        const subs = await SubMenuItem.find({}).lean();
        console.log(`📂 Found ${subs.length} subcategories in database.`);

        const workbook = XLSX.readFile(filePath);
        const sheetName = 'Romil';
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            console.error(`❌ Sheet "${sheetName}" not found`);
            process.exit(1);
        }

        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const rows = data.slice(1); // Skip header
        console.log(`📊 Processing ${rows.length} rows from sheet "${sheetName}"...`);

        let womenCount = 0;
        let kidsCount = 0;
        let skippedCount = 0;

        for (const row of rows) {
            const itemName = String(row[0] || '').trim();
            const sellPrice = parseFloat(row[3]) || 0;
            const description = String(row[4] || '').trim();
            const sku = String(row[14] || '').trim();

            if (!itemName && !description) {
                skippedCount++;
                continue;
            }

            // 1. Build Title
            const fullTitle = `${itemName} ${description}`.trim();

            // 2. Identify Category
            // Logic to assign category based on keywords
            let categoryLabel = 'Uncategorized';
            let categorySlug = 'uncategorized';

            const searchStr = fullTitle.toUpperCase(); // Using searchStr as in original code

            if (searchStr.includes('SILK') || searchStr.includes('PAITHANI') || searchStr.includes('TUSSUR') || searchStr.includes('IKKAT')) {
                categoryLabel = 'Wedding → Silk Sarees';
                categorySlug = 'silk-sarees';
            } else if (searchStr.includes('COTTON') || searchStr.includes('CHANDERI') || searchStr.includes('MUL')) {
                categoryLabel = 'Wedding → Cotton Sarees';
                categorySlug = 'cotton-sarees';
            } else if (searchStr.includes('SAREE') || searchStr.includes('SARRE') || searchStr.includes('SRE')) {
                categoryLabel = 'Wedding → Designer Sarees';
                categorySlug = 'designer-sarees';
            } else if (searchStr.includes('GOWN') || searchStr.includes('DRESS')) {
                categoryLabel = 'Dresses → Gown and Dresses';
                categorySlug = 'gown-and-dresses';
            } else if (searchStr.includes('KURTA') || searchStr.includes('KURTI')) {
                categoryLabel = 'Kurtas → Straight Kurtas';
                categorySlug = 'straight-kurtas';
            } else if (searchStr.includes('LEHNGA') || searchStr.includes('LEHENGA')) {
                categoryLabel = 'Wedding → Bridal Lehengas';
                categorySlug = 'bridal-lehengas';
            }

            // 3. Extract Sizes
            const sizes = [];
            if (row[9]) sizes.push('M');
            if (row[10]) sizes.push('L');
            if (row[11]) sizes.push('XL');
            if (row[12]) sizes.push('2XL');

            // 4. Identify Material
            let material = '';
            if (searchStr.includes('SILK')) material = 'Silk';
            else if (searchStr.includes('COTTON')) material = 'Cotton';
            else if (searchStr.includes('MUL')) material = 'Mul Cotton';
            else if (searchStr.includes('LINEN')) material = 'Linen';

            const isKids = searchStr.includes('KIDS') || searchStr.includes('BOY') || searchStr.includes('GIRL');
            const Model = isKids ? KidsProduct : WomenProduct;

            const productData = {
                title: fullTitle,
                price: sellPrice,
                category: categoryLabel,
                categorySlug: categorySlug,
                description: sku ? `Code: ${sku}` : '',
                material: material,
                sizes: sizes,
                images: [],
                isActive: true
            };

            if (isKids) {
                productData.gender = searchStr.includes('BOY') ? 'Boys' : 'Girls';
            }

            await new Model(productData).save();
            if (isKids) kidsCount++; else womenCount++;
        }

        console.log(`\n✅ Advanced Import Complete!`);
        console.log(`✨ New Women Products: ${womenCount}`);
        console.log(`✨ New Kids Products: ${kidsCount}`);
        console.log(`⏩ Skipped: ${skippedCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during advanced import:', err);
        process.exit(1);
    }
}

advancedImport();
