import express from "express";
import { 
  jobInputUpload, 
  jobOutputUpload 
} from "../middlewares/multerUploads.js";
import {
  createJobInputFile,
  linkProjectFileToJob,
  getJobInputFiles,
  getJobInputFileById,
  updateJobInputFile,
  deleteJobInputFile,
  downloadFile,
  downloadJobInputFilesAsZip,
  downloadJobInputFilesByProjectAsZip,
} from "../controllers/jobs/jonInputFiles.js";
import {
  createJobOutputFile,
  getJobOutputFiles,
  getJobOutputFileById,
  updateJobOutputFile,
  deleteJobOutputFile,
  addToProjectOutput,
  downloadJobOutputFilesAsZip,
  downloadJobOutputFilesByProjectAsZip,
} from "../controllers/jobs/jobOutputFiles.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

// ========== JOB INPUT FILES ==========
router.post("/job-input-files", jobInputUpload, createJobInputFile);
router.post("/job-input-files/link", linkProjectFileToJob);
router.get("/job-input-files", getJobInputFiles);
router.get("/job-input-files/:id", getJobInputFileById);
router.put("/job-input-files/:id", updateJobInputFile);
router.delete("/job-input-files/:id", deleteJobInputFile);

// ========== JOB OUTPUT FILES ==========
router.post("/job-output-files", jobOutputUpload, createJobOutputFile);
router.get("/job-output-files", getJobOutputFiles);
router.get("/job-output-files/:id", getJobOutputFileById);
router.put("/job-output-files/:id", jobOutputUpload, updateJobOutputFile);
router.delete("/job-output-files/:id", deleteJobOutputFile);
router.post("/job-output-files/:id/add-to-project", addToProjectOutput);

// Download routes
router.get("/download-file", authenticateToken, downloadFile);
router.get(
  "/job-input-files/download-zip",
  authenticateToken,
  downloadJobInputFilesAsZip
);
router.get(
  "/job-output-files/download-zip",
  authenticateToken,
  downloadJobOutputFilesAsZip
);
router.get(
  "/job-input-files/download-zip-by-project",
  authenticateToken,
  downloadJobInputFilesByProjectAsZip
);

router.get(
  "/job-output-files/download-zip-by-project",
  authenticateToken,
  downloadJobOutputFilesByProjectAsZip
);

export default router;