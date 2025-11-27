import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // image URL or file path
      required: true,
    },
    details: {
      type: String, // jab image pe click kare tab ka full description
      required: true,
    },
    rightSection: {
      type: String, // fixed right-side content (admin se editable)
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ indexing for faster sorting/filtering
gallerySchema.index({ createdAt: -1 });

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
