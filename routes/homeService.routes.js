// backend/routes/homeService.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/homeService.controller");

let upload;
try {
  upload = require("../middleware/upload");
} catch {
  upload = { single: () => (req, res, next) => next() };
}

// Public
router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getBySlug);

// Admin
router.post("/admin", upload.single("media"), ctrl.create);
router.patch("/admin/:id", upload.single("media"), ctrl.update);
router.delete("/admin/:id", ctrl.delete);

// Seed
router.get("/seed/init", ctrl.seed);

module.exports = router;
