import express from "express";
import {
  getAllUnits,
  addUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/setup/adminUnits.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken); 

router.get("/", getAllUnits);
router.post("/", addUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;
