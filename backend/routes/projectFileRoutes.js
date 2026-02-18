import express from "express";
import { 
  projectInputUpload, 
  projectOutputUpload 
} from "../middlewares/multerUploads.js";
import {
  createProjectInputFile,
  updateProjectInputFile,
  getAllProjectInputFiles,
  getProjectInputFileById,
  deleteProjectInputFile,
  getClientInputFiles,
} from "../controllers/project/projectInputFiles.js";
import {
  createProjectOutputFile,
  getProjectOutputFiles,
  getProjectOutputFileById,
  updateProjectOutputFile,
  deleteProjectOutputFile,
  downloadProjectOutputFilesAsZip,
} from "../controllers/project/projectOutputFiles.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/client/:id/input-files", getClientInputFiles);

// ========== PROJECT INPUT FILES ==========
router.post("/project-input-files", projectInputUpload, createProjectInputFile);
router.get("/project-input-files", getAllProjectInputFiles);
router.get("/project-input-files/:id", getProjectInputFileById);
router.put("/project-input-files/:id", projectInputUpload, updateProjectInputFile);
router.delete("/project-input-files/:id", deleteProjectInputFile);

// ========== PROJECT OUTPUT FILES ==========
router.post("/project-output-files", projectOutputUpload, createProjectOutputFile);
router.get("/project-output-files", getProjectOutputFiles);
router.get("/project-output-files/:id", getProjectOutputFileById);
router.put("/project-output-files/:id", projectOutputUpload, updateProjectOutputFile);
router.delete("/project-output-files/:id", deleteProjectOutputFile);

router.get(
  "/project-output-files/download-zip",
  downloadProjectOutputFilesAsZip
);

export default router;