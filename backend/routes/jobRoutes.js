import express from "express";
import {
  createJob,
  getJobsByProject,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStatusHistory,
} from "../controllers/jobs/jobDetails.js";
import {
  changeJobStatus,
  vendorAcceptOffer,
  vendorRejectOffer,
  startJob,
  getJobStatusTimeline,
} from "../controllers/jobs/jobStatusHistory.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Job CRUD
router.post("/jobs", authenticateToken, createJob);
router.get("/jobs", authenticateToken, getAllJobs);
router.get("/projects/:projectId/jobs", authenticateToken, getJobsByProject);
router.get("/jobs/:id", authenticateToken, getJobById);
router.put("/jobs/:id", authenticateToken, updateJob);
router.delete("/jobs/:id", authenticateToken, deleteJob);

// Job Status 
router.post("/jobs/:id/status", authenticateToken, changeJobStatus);
router.post("/jobs/:id/start", authenticateToken, startJob);
router.get("/jobs/:id/status-history", authenticateToken, getJobStatusHistory);
router.get("/jobs/:id/timeline", getJobStatusTimeline);

// Vendor actions
router.post("/jobs/:id/accept", vendorAcceptOffer);
router.post("/jobs/:id/reject", vendorRejectOffer);

export default router;