// backend/routes/watchBuy.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/watchBuyController");

// optional auth if your project has middleware/auth
let auth;
try {
  auth = require("../middleware/auth");
} catch (err) {
  auth = (req, res, next) => next();
}

// ensure uploads folder exists
const fs = require("fs");
const uploadDir = path.join(process.cwd(), "uploads", "watchbuy");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, name);
  },
});

const upload = multer({ storage });

// routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// POST: add new (media required)
router.post("/", auth, upload.fields([{ name: "media", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), controller.create);

// PUT: update (optional files)
router.put("/:id", auth, upload.fields([{ name: "media", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), controller.update);

// DELETE
router.delete("/:id", auth, controller.remove);

module.exports = router;
