const Service = require("../models/Service.model");
const slugify = (s) =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

// Get all services (public)
exports.getAllServices = async (req, res) => {
  try {
    const { type, q } = req.query;
    const filter = { active: true };
    if (type) filter.type = type;
    if (q) filter.$or = [
      { title: new RegExp(q, "i") },
      { shortDesc: new RegExp(q, "i") },
      { tags: new RegExp(q, "i") },
    ];

    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (err) {
    console.error("getAllServices:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single service by slug (public)
exports.getServiceBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const service = await Service.findOne({ slug, active: true });
    if (!service) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, service });
  } catch (err) {
    console.error("getServiceBySlug:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create service (admin)
exports.createService = async (req, res) => {
  try {
    const {
      title,
      slug: bodySlug,
      type = "design",
      shortDesc,
      longDesc,
      order = 0,
      tags = "[]",
      tiers = "[]",
    } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const slug = (bodySlug && slugify(bodySlug)) || slugify(title);

    // handle images: req.files.image and req.files.gallery (fields)
    let images = [];
    let gallery = [];

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        images.push(`/uploads/${req.files.image[0].filename}`);
      }
      if (req.files.gallery && req.files.gallery.length) {
        gallery = req.files.gallery.map((f) => `/uploads/${f.filename}`);
      }
    }

    // allow passing image/gallery URLs in body as fallback
    if ((!images || images.length === 0) && req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    if ((!gallery || gallery.length === 0) && req.body.gallery) {
      gallery = Array.isArray(req.body.gallery) ? req.body.gallery : [req.body.gallery];
    }

    const parsedTags = typeof tags === "string" ? JSON.parse(tags || "[]") : tags;
    const parsedTiers = typeof tiers === "string" ? JSON.parse(tiers || "[]") : tiers;

    const newService = new Service({
      title,
      slug,
      type,
      shortDesc,
      longDesc,
      images,
      gallery,
      order: Number(order),
      tags: parsedTags,
      tiers: parsedTiers,
      featured: req.body.featured === "true" || req.body.featured === true,
      active: req.body.active === "false" ? false : true,
    });

    await newService.save();
    res.status(201).json({ success: true, service: newService });
  } catch (err) {
    console.error("createService:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update service (admin)
exports.updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = { ...req.body };

    // parse arrays if sent as JSON strings
    if (payload.tags && typeof payload.tags === "string") {
      payload.tags = JSON.parse(payload.tags || "[]");
    }
    if (payload.tiers && typeof payload.tiers === "string") {
      payload.tiers = JSON.parse(payload.tiers || "[]");
    }
    if (payload.order) payload.order = Number(payload.order);

    // handle uploaded files
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        payload.images = [`/uploads/${req.files.image[0].filename}`];
      }
      if (req.files.gallery && req.files.gallery.length) {
        payload.gallery = req.files.gallery.map((f) => `/uploads/${f.filename}`);
      }
    }

    // if slug provided, slugify it
    if (payload.slug) payload.slug = slugify(payload.slug);

    payload.updatedAt = Date.now();

    const updated = await Service.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, service: updated });
  } catch (err) {
    console.error("updateService:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete service (admin)
exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Service.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Deleted", removed });
  } catch (err) {
    console.error("deleteService:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Seed demo data (admin/public)
exports.seedData = async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) return res.json({ success: true, message: "Already seeded" });

    const seedData = [
      {
        title: "Sample Production",
        slug: "sample-production",
        type: "design",
        shortDesc: "End-to-end sample production for small brands",
        longDesc: "We make samples with attention to detail...",
        images: ["/uploads/sample1.jpg"],
        gallery: [],
        order: 1,
        tags: ["sample", "production"],
        tiers: [{ name: "Basic", priceFrom: 0, priceTo: 0 }],
      },
      {
        title: "Small Batch Manufacturing",
        slug: "small-batch-manufacturing",
        type: "custom",
        shortDesc: "Low-run manufacturing for startups",
        longDesc: "We handle small runs with care...",
        images: ["/uploads/sample2.jpg"],
        gallery: [],
        order: 2,
        tags: ["manufacturing"],
        tiers: [{ name: "Starter", priceFrom: 1000, priceTo: 5000 }],
      },
    ];

    await Service.insertMany(seedData);
    res.json({ success: true, message: "Seed inserted successfully" });
  } catch (err) {
    console.error("seedData:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
