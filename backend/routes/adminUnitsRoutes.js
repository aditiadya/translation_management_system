import express from "express";
import {
  getAllUnits,
  addUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/setup/adminUnits.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from "../middlewares/validate.js";
import { createAdminUnitSchema, updateAdminUnitSchema } from "../validators/adminUnits.js";

const router = express.Router();

router.use(authenticateToken); 

router.get("/", getAllUnits);
router.post("/", validate(createAdminUnitSchema), addUnit);
router.put("/:id", validate(updateAdminUnitSchema), updateUnit);
router.delete("/:id", deleteUnit);

export default router;
