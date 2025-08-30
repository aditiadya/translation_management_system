import express from "express";
import {
  getAdminProfile,
  addAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
} from "../controllers/admin/adminProfile.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createAdminProfileSchema,
  updateAdminProfileSchema,
} from "../validators/adminProfile.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAdminProfile);
router.post("/", validate(createAdminProfileSchema), addAdminProfile);
router.put("/", validate(updateAdminProfileSchema), updateAdminProfile);
router.delete("/", deleteAdminProfile);

export default router;
