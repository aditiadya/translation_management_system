import express from "express";
import { clientUpload } from "../middlewares/multerUploads.js";
import { createClientDocument } from "../controllers/client/clientDocument.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/upload", clientUpload.single("file"), createClientDocument);

export default router;
