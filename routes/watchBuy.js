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

const { uploadWatchBuy } = require("../middleware/upload");

// routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// POST: add new (media required)
router.post("/", auth, uploadWatchBuy.fields([{ name: "media", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), controller.create);

// PUT: update (optional files)
router.put("/:id", auth, uploadWatchBuy.fields([{ name: "media", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), controller.update);

// DELETE
router.delete("/:id", auth, controller.remove);

module.exports = router;
