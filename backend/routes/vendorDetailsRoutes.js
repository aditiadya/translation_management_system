import express from "express";
import {
  createVendor,
  updateVendor,
  getVendorById,
  deleteVendor,
  getAllVendors,
} from "../controllers/vendor/vendorDetails.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorSchema,
  updateVendorSchema,
  deleteVendorSchema,
  getVendorSchema,
} from "../validators/vendor.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createVendorSchema), createVendor);
router.put("/:id", validate(updateVendorSchema), updateVendor);
router.get("/:id", validate(getVendorSchema), getVendorById);
router.get("/", getAllVendors);
router.delete("/:id", validate(deleteVendorSchema), deleteVendor);

export default router;