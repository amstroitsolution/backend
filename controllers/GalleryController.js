import Gallery from "../models/GalleryModel.js";
import path from "path";
import fs from "fs";

// ✅ Add new gallery item
export const addGalleryItem = async (req, res) => {
  try {
    const { title, description, details, rightSection } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newItem = await Gallery.create({
      title,
      description,
      image,
      details,
      rightSection,
    });

    res.status(201).json({ message: "Gallery item added successfully", data: newItem });
  } catch (error) {
    console.error("Error adding gallery item:", error);
    res.status(500).json({ message: "Error adding gallery item", error: error.message });
  }
};

// ✅ Get all gallery items
export const getAllGallery = async (req, res) => {
  try {
    const data = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ message: "Error fetching gallery", error: error.message });
  }
};

// ✅ Get single gallery item
export const getSingleGallery = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching single item:", error);
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
};

// ✅ Update gallery item
export const updateGallery = async (req, res) => {
  try {
    const { title, description, details, rightSection } = req.body;
    const updateData = { title, description, details, rightSection };

    // Agar naya image upload hua hai
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.status(200).json({ message: "Gallery updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ message: "Error updating gallery", error: error.message });
  }
};

// ✅ Delete gallery item
export const deleteGallery = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (item.image && item.image.startsWith('/uploads/')) {
      const imgPath = path.join(process.cwd(), item.image);
      if (fs.existsSync(imgPath)) {
        try { fs.unlinkSync(imgPath); } catch (e) { console.error('Local delete failed:', e); }
      }
    }

    await item.deleteOne();
    res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ message: "Error deleting gallery", error: error.message });
  }
};
