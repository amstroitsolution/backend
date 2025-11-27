// backend/models/HomeService.model.js
const mongoose = require("mongoose");

const HomeServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDesc: { type: String },
    longDesc: { type: String },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    mediaUrl: { type: String }, // image/video URL
    buttonText: { type: String },
    buttonLink: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeService", HomeServiceSchema);
