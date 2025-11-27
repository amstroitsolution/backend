// backend/controllers/workController.js
const Work = require("../models/Work");
const path = require("path");
const { unlinkMany } = require("../utils/fileHelpers");

/**
 * Create a new work item.
 * Accepts multipart/form-data (fields + images[] files).
 */
exports.createWork = async (req, res, next) => {
  try {
    const { title, shortDescription, longDescription, category, featured, order, active } = req.body;

    // convert uploaded images to relative paths
    const images = (req.files || []).map((f) =>
      path.join("/", process.env.UPLOAD_DIR || "uploads", "works", f.filename).replace(/\\/g, "/")
    );

    if (!title) return res.status(400).json({ message: "Title is required" });

    const work = new Work({
      title,
      shortDescription,
      longDescription,
      category,
      images,
      featured: featured === "true" || featured === true,
      order: order ? Number(order) : 0,
      active: active === "false" ? false : true,
    });

    await work.save();
    res.status(201).json(work);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all work items (supports filters).
 */
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, category, q } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { active: true };
    if (category) filter.category = category;
    if (q) filter.title = new RegExp(q, "i");

    const total = await Work.countDocuments(filter);
    const items = await Work.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ total, page: Number(page), limit: Number(limit), items });
  } catch (err) {
    next(err);
  }
};

/**
 * Get one work item by ID.
 */
exports.getOne = async (req, res, next) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.json(work);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing work.
 * Can upload new images or remove old ones (removeImages[]).
 */
exports.updateWork = async (req, res, next) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    const { title, shortDescription, longDescription, category, featured, order, active, removeImages } = req.body;

    // Update text fields
    if (title !== undefined) work.title = title;
    if (shortDescription !== undefined) work.shortDescription = shortDescription;
    if (longDescription !== undefined) work.longDescription = longDescription;
    if (category !== undefined) work.category = category;
    if (featured !== undefined) work.featured = featured === "true" || featured === true;
    if (order !== undefined) work.order = Number(order);
    if (active !== undefined) work.active = active === "true" || active === true;

    // Add newly uploaded images
    const newImages = (req.files || []).map((f) =>
      path.join("/", process.env.UPLOAD_DIR || "uploads", "works", f.filename).replace(/\\/g, "/")
    );
    if (newImages.length) work.images = (work.images || []).concat(newImages);

    // Remove images if requested
    let removeList = [];
    if (removeImages) {
      if (typeof removeImages === "string") {
        try {
          removeList = JSON.parse(removeImages);
        } catch {
          removeList = [removeImages];
        }
      } else if (Array.isArray(removeImages)) removeList = removeImages;
    }

    if (removeList.length) {
      work.images = (work.images || []).filter((img) => !removeList.includes(img));
      await unlinkMany(removeList);
    }

    await work.save();
    res.json(work);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete work and its images from disk.
 */
exports.deleteWork = async (req, res, next) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    await unlinkMany(work.images || []);
    res.json({ message: "Work deleted successfully", id: req.params.id });
  } catch (err) {
    next(err);
  }
};
