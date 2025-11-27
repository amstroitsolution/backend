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

// 📂 Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // relative to project root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Routes
router.post("/add", upload.single("image"), addGalleryItem);
router.get("/", getAllGallery);
router.get("/:id", getSingleGallery);
router.put("/:id", upload.single("image"), updateGallery);
router.delete("/:id", deleteGallery);

export default router;
