import express from "express";
import {
  getVendorProfile,
  addVendorProfile,
  updateVendorProfile,
  deleteVendorProfile,
} from "../controllers/vendor/vendorProfile.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorProfileSchema,
  updateVendorProfileSchema,
} from "../validators/vendorProfile.schema.js";

const router = express.Router();

router.get("/", getVendorProfile);
router.post("/", validate(createVendorProfileSchema), addVendorProfile);
router.put("/", validate(updateVendorProfileSchema), updateVendorProfile);
router.delete("/", deleteVendorProfile);

export default router;
