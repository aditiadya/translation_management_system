import express from "express";
import {
  createProject,
  updateProject,
  getProjectById,
  getAllProjects,
  deleteProject,
} from "../controllers/project/projectDetails.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createProject);
router.put("/:id", updateProject);
router.get("/:id", getProjectById);
router.get("/", getAllProjects);
router.delete("/:id", deleteProject);

export default router;