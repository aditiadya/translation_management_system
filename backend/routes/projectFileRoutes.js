import express from "express";
import { projectInputUpload } from "../middlewares/multerUploads.js";
import {
  createProjectInputFile,
  updateProjectInputFile,
  getAllProjectInputFiles,
  getProjectInputFileById,
  deleteProjectInputFile
} from "../controllers/project/projectInputFiles.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/project-input-files", projectInputUpload, createProjectInputFile);
router.get("/project-input-files", getAllProjectInputFiles);
router.get("/project-input-files/:id", getProjectInputFileById);
router.put("/project-input-files/:id", projectInputUpload, updateProjectInputFile);
router.delete("/project-input-files/:id", deleteProjectInputFile);

export default router;