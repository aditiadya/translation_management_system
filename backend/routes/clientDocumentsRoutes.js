import express from "express";
import { clientUpload } from "../middlewares/multerUploads.js";
import { validateFileUpload } from "../validators/fileUpload.validator.js";
import {
  createClientDocument,
  getAllClientDocuments,
  getClientDocumentById,
  updateClientDocument,
  deleteClientDocument,
} from "../controllers/client/clientDocument.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// FIXED: Validator runs BEFORE controller
router.post("/upload", clientUpload, validateFileUpload, createClientDocument);
router.get("/", getAllClientDocuments);
router.get("/:id", getClientDocumentById);
router.put("/:id", clientUpload, validateFileUpload, updateClientDocument);
router.delete("/:id", deleteClientDocument);

export default router;
