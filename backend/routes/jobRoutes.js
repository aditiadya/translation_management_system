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
import { requireRole, ADMIN_AND_MANAGERS, VENDOR } from '../middlewares/requireRole.js';

const router = express.Router();

// Job CRUD - admin and managers only
router.post("/jobs", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), createJob);
router.get("/jobs", authenticateToken, requireRole(...ADMIN_AND_MANAGERS, ...VENDOR), getAllJobs);
router.get("/projects/:projectId/jobs", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), getJobsByProject);
router.get("/jobs/:id", authenticateToken, requireRole(...ADMIN_AND_MANAGERS, ...VENDOR), getJobById);
router.put("/jobs/:id", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), updateJob);
router.delete("/jobs/:id", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), deleteJob);

// Job Status - admin and managers only
router.post("/jobs/:id/status", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), changeJobStatus);
router.post("/jobs/:id/start", authenticateToken, requireRole(...ADMIN_AND_MANAGERS), startJob);
router.get("/jobs/:id/status-history", authenticateToken, requireRole(...ADMIN_AND_MANAGERS, ...VENDOR), getJobStatusHistory);
router.get("/jobs/:id/timeline", authenticateToken, requireRole(...ADMIN_AND_MANAGERS, ...VENDOR), getJobStatusTimeline);

// Vendor actions - vendor only
router.post("/jobs/:id/accept", authenticateToken, requireRole(...VENDOR), vendorAcceptOffer);
router.post("/jobs/:id/reject", authenticateToken, requireRole(...VENDOR), vendorRejectOffer);

export default router;