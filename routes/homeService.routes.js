// backend/routes/homeService.routes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/homeService.controller");
const { uploadGeneral } = require("../middleware/upload");

// Public
router.get("/", ctrl.getAll);
router.get("/:slug", ctrl.getBySlug);

// Admin
router.post("/admin", uploadGeneral.single("media"), ctrl.create);
router.patch("/admin/:id", uploadGeneral.single("media"), ctrl.update);
router.delete("/admin/:id", ctrl.delete);

// Seed
router.get("/seed/init", ctrl.seed);

module.exports = router;
