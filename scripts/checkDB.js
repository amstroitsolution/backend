const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const fs = require('fs');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        const WomenProduct = require('../models/WomenProduct');
        const count = await WomenProduct.countDocuments({});
        const samples = await WomenProduct.find({}).limit(5).lean();

        let report = `DB Host: ${new URL(process.env.MONGO_URI).host}\n`;
        report += `Collections: ${collections.map(c => c.name).join(', ')}\n`;
        report += `Total Women Products: ${count}\n`;
        report += `Samples:\n${JSON.stringify(samples, null, 2)}\n`;

        fs.writeFileSync('db_check_report.txt', report);
        console.log('✅ Report written to db_check_report.txt');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_check_report.txt', 'ERROR: ' + err.message);
        process.exit(1);
    }
}

check();
