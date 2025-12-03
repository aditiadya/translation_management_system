import express from "express";
import {
  getProjectStatusHistory,
} from "../controllers/project/projectStatusHistory.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get("/:id", getProjectStatusHistory);

export default router;