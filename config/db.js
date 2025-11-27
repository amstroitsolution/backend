// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI not set in .env");
      return;
    }

    // options are optional — tweak if needed
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected:", mongoose.connection.host);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // optionally exit the process in production:
    // process.exit(1);
  }
};

module.exports = connectDB;
