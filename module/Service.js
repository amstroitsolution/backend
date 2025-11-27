const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["stitching", "sale", "rent"] },
    shortDesc: { type: String },
    longDesc: { type: String },
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
