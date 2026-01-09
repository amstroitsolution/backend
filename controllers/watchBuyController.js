// backend/controllers/watchBuyController.js
const fs = require("fs");
const path = require("path");
const WatchBuy = require("../models/WatchBuy");

/**
 * Helpers
 */
const removeFile = (relPath) => {
  try {
    const full = path.join(process.cwd(), relPath);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (err) {
    console.warn("Failed to remove file:", relPath, err.message);
  }
};

/**
 * GET /api/watchbuy
 */
exports.getAll = async (req, res) => {
  try {
    const items = await WatchBuy.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("GET /api/watchbuy error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/watchbuy/:id
 */
exports.getById = async (req, res) => {
  try {
    const item = await WatchBuy.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("GET /api/watchbuy/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/watchbuy
 * multipart form:
 *  - title (string)
 *  - description (string)
 *  - price (number, optional)
 *  - media (file)  --> required
 *  - thumbnail (file) --> optional (for video poster or image duplicate)
 */
exports.create = async (req, res) => {
  try {
    const { title = "", description = "", price } = req.body;
    // files via multer
    const mediaFile = req.files?.media?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    if (!title || !mediaFile) {
      return res.status(400).json({ message: "Title and media file are required" });
    }

    const ext = path.extname(mediaFile.originalname).toLowerCase();
    const isVideo = [".mp4", ".mov", ".webm", ".mkv"].includes(ext);
    const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);

    const mediaType = isVideo ? "video" : isImage ? "image" : "image";

    const mediaUrl = mediaFile.path;
    const thumbnailUrl = thumbFile ? thumbFile.path : (mediaType === "image" ? mediaUrl : "");

    const item = await WatchBuy.create({
      title,
      description,
      price: price ? Number(price) : null,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      published: true,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("POST /api/watchbuy error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/watchbuy/:id
 * You can update fields and optionally replace media/thumbnail files
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await WatchBuy.findById(id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const { title, description, price, published } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price === "" ? null : Number(price);
    if (published !== undefined) updateData.published = published === "true" || published === true;

    // handle new files
    const mediaFile = req.files?.media?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    if (mediaFile) {
      // remove old media file (if stored locally)
      if (existing.mediaUrl && existing.mediaUrl.startsWith("/uploads/")) removeFile(existing.mediaUrl);
      const isVideo = mediaFile.mimetype.startsWith('video/');
      updateData.mediaType = isVideo ? "video" : "image";
      updateData.mediaUrl = mediaFile.path;
    }

    if (thumbFile) {
      if (existing.thumbnailUrl && existing.thumbnailUrl.startsWith("/uploads/")) removeFile(existing.thumbnailUrl);
      updateData.thumbnailUrl = thumbFile.path;
    }

    const updated = await WatchBuy.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/watchbuy/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/watchbuy/:id
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await WatchBuy.findById(id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    // remove files if local
    if (existing.mediaUrl && existing.mediaUrl.startsWith("/uploads/")) removeFile(existing.mediaUrl);
    if (existing.thumbnailUrl && existing.thumbnailUrl.startsWith("/uploads/")) removeFile(existing.thumbnailUrl);

    await WatchBuy.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/watchbuy/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
