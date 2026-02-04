const express = require("express");
const dotenv = require("dotenv");

// ⚠️ CRITICAL: Load environment variables FIRST before ANY other imports!
dotenv.config();

const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Import routes
const servicesRoute = require("./routes/services");
const equipmentRoutes = require("./routes/equipment");
const authRoute = require("./routes/auth");
const galleryRoute = require("./routes/gallery");
const workRoutes = require("./routes/workRoutes");
const homeServiceRoute = require("./routes/homeService.routes");

// ✅ NEW: Watch & Buy route
const watchBuyRoutes = require("./routes/watchBuy"); // ✅ added cleanly

// ✅ NEW: Hero route
const heroRoutes = require("./routes/hero");

// ✅ NEW: Kids Products route
const kidsProductsRoutes = require("./routes/kidsProducts");

// ✅ NEW: Women Products route
const womenProductsRoutes = require("./routes/womenProducts");

// ✅ NEW: Dynamic Sections route
const sectionsRoutes = require("./routes/sections");

// ✅ NEW: Kids Sections route
const kidsSectionsRoutes = require("./routes/kidsSections");

// ✅ NEW: Home Page Sections routes
const trendingItemsRoutes = require("./routes/trendingItems");
const newArrivalsRoutes = require("./routes/newArrivals");
const specialOffersRoutes = require("./routes/specialOffers");
const featuredCollectionsRoutes = require("./routes/featuredCollections");

// ✅ NEW: Inquiry routes
const inquiryRoutes = require("./routes/inquiry");

// ✅ NEW: Contact routes
const contactRoutes = require("./routes/contact");

// NEW: Our Values and Slow Fashion routes
let ourValuesRoutes, slowFashionRoutes;
try {
  ourValuesRoutes = require("./routes/ourValues");
  console.log("✅ Our Values routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading Our Values routes:", error.message);
}

try {
  slowFashionRoutes = require("./routes/slowFashion");
  console.log("✅ Slow Fashion routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading Slow Fashion routes:", error.message);
}

// NEW: Top Strip route
const topStripRoutes = require("./routes/topStrip");

// NEW: BestSellers route
const bestSellersRoutes = require("./routes/bestSellers");

// NEW: Shop Categories route
const shopCategoriesRoutes = require("./routes/shopCategories");

// NEW: Menu/Navbar route
const menuRoutes = require("./routes/menu");

// NEW: Search route
const searchRoutes = require("./routes/search");

// NEW: Testimonials route
const testimonialsRoutes = require("./routes/testimonials");

// NEW: Stats route
const statsRoutes = require("./routes/stats");

// NEW: FAQs route
const faqsRoutes = require("./routes/faqs");

// NEW: Kids Hero route
const kidsHeroRoutes = require("./routes/kidsHero");

// Environment variables already loaded at top of file

if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment. Set it in .env");
}

const app = express();

// ✅ Proper CORS config (for frontend + admin)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // frontend (local)
      "http://localhost:5174", // admin dashboard (local)
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://yashper.com", // frontend (production)
      "https://www.yashper.com", // frontend with www (production)
      "https://admin.yashper.com", // admin dashboard (production)
      "https://yashper-admin.vercel.app", // frontend on Vercel
      "https://yashper-admin-ashy.vercel.app", // admin on Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploads folder (for photos & videos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB
connectDB();

// ✅ Auth route
app.use("/api/auth", authRoute);

// Initialize dynamic sections (for initial seed)
const initializeContentSections = require("./scripts/initializeContentSections");
setTimeout(async () => {
  try {
    await initializeContentSections();
  } catch (error) {
    console.error("❌ Failed to initialize content sections:", error);
  }
}, 2000);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Yashper Backend is running successfully 🚀");
});

// ✅ Mount all API routes
app.use("/api/services", servicesRoute);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/gallery", galleryRoute);
app.use("/api/works", workRoutes);
app.use("/api/home-services", homeServiceRoute);

// ✅ NEW: Watch & Buy route mount
app.use("/api/watchbuy", watchBuyRoutes);

// ✅ NEW: Hero route mount
app.use("/api/hero", heroRoutes);

// ✅ NEW: Kids Products route mount
app.use("/api/kids-products", kidsProductsRoutes);

// ✅ NEW: Women Products route mount
app.use("/api/women-products", womenProductsRoutes);

// ✅ NEW: Dynamic Sections route mount
app.use("/api/sections", sectionsRoutes);

// ✅ NEW: Kids Sections route mount
app.use("/api/kids-sections", kidsSectionsRoutes);

// ✅ NEW: Home Page Sections route mounts
app.use("/api/trending-items", trendingItemsRoutes);
app.use("/api/new-arrivals", newArrivalsRoutes);
app.use("/api/special-offers", specialOffersRoutes);
app.use("/api/featured-collections", featuredCollectionsRoutes);

// ✅ NEW: Inquiry route mount
app.use("/api/inquiries", inquiryRoutes);

// ✅ NEW: Contact route mount
app.use("/api/contact", contactRoutes);

// ✅ TEST: Email test route
const testEmailRoutes = require("./routes/testEmail");
app.use("/api/test-email", testEmailRoutes);

if (ourValuesRoutes) {
  app.use("/api/our-values", ourValuesRoutes);
  console.log("✅ Our Values routes mounted at /api/our-values");
} else {
  console.error("❌ Our Values routes not mounted - module failed to load");
}

// Our Values Settings routes
const ourValuesSettingsRoutes = require("./routes/ourValuesSettings");
app.use("/api/our-values-settings", ourValuesSettingsRoutes);
console.log("✅ Our Values Settings routes mounted at /api/our-values-settings");

if (slowFashionRoutes) {
  app.use("/api/slow-fashion", slowFashionRoutes);
  console.log("✅ Slow Fashion routes mounted at /api/slow-fashion");
} else {
  console.error("❌ Slow Fashion routes not mounted - module failed to load");
}

// ✅ NEW: Top Strip route
app.use("/api/top-strip", topStripRoutes);
console.log("✅ Top Strip route mounted");

// ✅ NEW: BestSellers route
app.use("/api/bestsellers", bestSellersRoutes);
console.log("✅ BestSellers route mounted");

// ✅ NEW: Shop Categories route
app.use("/api/shop-categories", shopCategoriesRoutes);
console.log("✅ Shop Categories route mounted");

// ✅ NEW: Menu/Navbar route
app.use("/api/menu", menuRoutes);
console.log("✅ Menu/Navbar route mounted");

// ✅ NEW: Search route
app.use("/api/search", searchRoutes);
console.log("✅ Search route mounted");

// ✅ NEW: Testimonials route
app.use("/api/testimonials", testimonialsRoutes);
console.log("✅ Testimonials route mounted");

// ✅ NEW: Stats route
app.use("/api/stats", statsRoutes);
console.log("✅ Stats route mounted");

// ✅ NEW: FAQs route
app.use("/api/faqs", faqsRoutes);
console.log("✅ FAQs route mounted");

// ✅ NEW: Kids Hero route
app.use("/api/kids-hero", kidsHeroRoutes);
console.log("✅ Kids Hero route mounted");

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully 🚀");
});

// ✅ Debug route — see all API endpoints
app.get("/api/debug/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const basePath = middleware.regexp.source
            .replace("\\/?(?=\\/|$)", "")
            .replace(/\\\//g, "/");
          routes.push({
            path: basePath + handler.route.path,
            methods: Object.keys(handler.route.methods),
          });
        }
      });
    }
  });

  res.json({
    message: "Available API routes",
    routes,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Health check route
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const OurValues = require("./models/OurValues");
    const SlowFashion = require("./models/SlowFashion");

    const health = {
      status: "OK",
      timestamp: new Date().toISOString(),
      database: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState,
      },
      collections: {
        ourValues: await OurValues.countDocuments(),
        slowFashion: await SlowFashion.countDocuments(),
      },
      routes: {
        ourValuesRoutes: !!ourValuesRoutes,
        slowFashionRoutes: !!slowFashionRoutes,
      },
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ✅ Global error handlers
process.on("uncaughtException", (err) => console.error("Uncaught:", err));
process.on("unhandledRejection", (err) => console.error("Unhandled:", err));

// ✅ Express Global Error Handler (prevents HTML responses for API errors)
app.use((err, req, res, next) => {
  console.error("🔥 Global API Error:", err);
  if (res.headersSent) {
    return next(err);
  }
  // Multer errors often have a code
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large", error: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
