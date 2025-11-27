// backend/models/WatchBuy.js
const mongoose = require("mongoose");

const WatchBuySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: null },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    mediaUrl: { type: String, required: true },     // path like "/uploads/watchbuy/xyz.mp4"
    thumbnailUrl: { type: String, default: "" },    // optional image/thumb
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WatchBuy", WatchBuySchema);
