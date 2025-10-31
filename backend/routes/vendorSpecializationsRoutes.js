import express from "express";
import {
  createVendorSpecialization,
  updateVendorSpecialization,
  getVendorSpecializationById,
  getAllVendorSpecializations,
  deleteVendorSpecialization,
} from "../controllers/vendor/vendorSpecializations.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorSpecializationSchema,
  updateVendorSpecializationSchema,
  getVendorSpecializationSchema,
  deleteVendorSpecializationSchema,
  getAllVendorSpecializationsSchema,
} from "../validators/vendorSpecializations.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createVendorSpecializationSchema), createVendorSpecialization);
router.put("/:id", validate(updateVendorSpecializationSchema), updateVendorSpecialization);
router.get("/:id", validate(getVendorSpecializationSchema), getVendorSpecializationById);
router.get("/", validate(getAllVendorSpecializationsSchema), getAllVendorSpecializations);
router.delete("/:id", validate(deleteVendorSpecializationSchema), deleteVendorSpecialization);

export default router;
