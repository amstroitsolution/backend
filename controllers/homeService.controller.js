// backend/controllers/homeService.controller.js
const HomeService = require("../models/HomeService.model");
const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

exports.getAll = async (req, res) => {
  try {
    const services = await HomeService.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const item = await HomeService.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: "Service not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      title,
      shortDesc,
      longDesc,
      buttonText,
      buttonLink,
      mediaType,
      order = 0,
    } = req.body;

    const slug = slugify(title);
    const mediaUrl = req.file
      ? req.file.path
      : req.body.mediaUrl || "";

    const newItem = new HomeService({
      title,
      slug,
      shortDesc,
      longDesc,
      buttonText,
      buttonLink,
      mediaType,
      mediaUrl,
      order,
    });

    await newItem.save();
    res.status(201).json({ message: "Home Service created", item: newItem });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = { ...req.body };
    if (req.file) payload.mediaUrl = req.file.path;
    const updated = await HomeService.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated successfully", item: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await HomeService.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: Seed sample items
exports.seed = async (req, res) => {
  try {
    const count = await HomeService.countDocuments();
    if (count > 0) return res.json({ message: "Already seeded" });

    const seedData = [
      {
        title: "Slow Fashion Store",
        slug: "slow-fashion-store",
        shortDesc: "Shop exclusive sustainable fashion products.",
        mediaType: "video",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        buttonText: "Shop Wholesale",
        buttonLink: "/shop",
        order: 1,
      },
      {
        title: "Manufacturing",
        slug: "manufacturing",
        shortDesc: "Book your manufacturing appointments easily.",
        mediaType: "video",
        mediaUrl: "https://www.w3schools.com/html/movie.mp4",
        buttonText: "Request an Appointment",
        buttonLink: "/manufacturing",
        order: 2,
      },
      {
        title: "Networking & Sales",
        slug: "networking-sales",
        shortDesc: "Connect and grow your business network.",
        mediaType: "video",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        buttonText: "Grow Your Business",
        buttonLink: "/networking",
        order: 3,
      },
      {
        title: "Learn & Excel",
        slug: "learn-excel",
        shortDesc: "Upskill yourself with experts.",
        mediaType: "video",
        mediaUrl: "https://www.w3schools.com/html/movie.mp4",
        buttonText: "Discover Solutions",
        buttonLink: "/learn",
        order: 4,
      },
    ];

    await HomeService.insertMany(seedData);
    res.json({ message: "Seed data inserted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
