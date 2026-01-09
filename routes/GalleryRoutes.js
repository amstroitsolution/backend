import express from "express";
import multer from "multer";
import {
  addGalleryItem,
  getAllGallery,
  getSingleGallery,
  updateGallery,
  deleteGallery,
} from "../controllers/GalleryController.js";

const router = express.Router();

import { uploadGallery } from "../middleware/upload";

// ✅ Routes
router.post("/add", uploadGallery.single("image"), addGalleryItem);
router.get("/", getAllGallery);
router.get("/:id", getSingleGallery);
router.put("/:id", uploadGallery.single("image"), updateGallery);
router.delete("/:id", deleteGallery);

export default router;
