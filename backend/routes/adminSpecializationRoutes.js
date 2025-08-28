import express from "express";
import {
  getAllSpecializations,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "../controllers/setup/adminSpecialization.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { createAdminSpecializationSchema, updateAdminSpecializationSchema } from "../validators/adminSpecialization.schema.js";


const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllSpecializations);
router.post("/", validate(createAdminSpecializationSchema), addSpecialization);
router.put("/:id", validate(updateAdminSpecializationSchema), updateSpecialization);
router.delete("/:id", deleteSpecialization);

export default router;
