const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const MenuItem = require('../models/MenuItem');
const SubMenuItem = require('../models/SubMenuItem');

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const menus = await MenuItem.find({}).lean();
    const subs = await SubMenuItem.find({}).lean();

    console.log('--- ALL CATEGORIES ---');
    subs.forEach(s => {
        const parent = menus.find(m => m._id.toString() === s.parentMenuId.toString());
        console.log(`${parent ? parent.label : 'Unknown'} -> ${s.name} (Slug: ${s.slug})`);
    });

    await mongoose.disconnect();
}
run();
