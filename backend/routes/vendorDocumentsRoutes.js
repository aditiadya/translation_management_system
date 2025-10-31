import express from "express";
import { vendorUpload } from "../middlewares/multerUploads.js";
import { validateFileUpload } from "../validators/fileUpload.validator.js";
import {
  createVendorDocument,
  getAllVendorDocuments,
  getVendorDocumentById,
  updateVendorDocument,
  deleteVendorDocument,
} from "../controllers/vendor/vendorDocument.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/upload", vendorUpload, createVendorDocument, validateFileUpload);
router.get("/", getAllVendorDocuments);
router.get("/:id", getVendorDocumentById);
router.put("/:id", vendorUpload, updateVendorDocument, validateFileUpload);
router.delete("/:id", deleteVendorDocument);

export default router;