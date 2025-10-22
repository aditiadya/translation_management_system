import express from "express";
import { vendorUpload } from "../middlewares/multerUploads.js";
import { createVendortDocument } from "../controllers/vendor/vendorDocument.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/upload", vendorUpload.single("file"), createVendortDocument);

export default router;