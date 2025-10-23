import express from "express";
import { clientUpload } from "../middlewares/multerUploads.js";
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

router.post("/upload", clientUpload.single("file"), createClientDocument);
router.get("/", getAllClientDocuments);
router.get("/:id", getClientDocumentById);
router.put("/:id", clientUpload.single("file"), updateClientDocument);
router.delete("/:id", deleteClientDocument);

export default router;
