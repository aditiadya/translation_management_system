import express from "express";
import {
  getAllSpecializations,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../controllers/setup/adminSpecialization.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllSpecializations);
router.post("/", addSpecialization);
router.put("/:id", updateSpecialization);
router.delete("/:id", deleteSpecialization);

export default router;
