import express from "express";
import {
  getVendorSettings,
  updateVendorSettings,
} from "../controllers/vendor/vendorSettings.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  getVendorSettingsSchema,
  updateVendorSettingsSchema,
} from "../validators/vendorSettings.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/:id", validate(getVendorSettingsSchema), getVendorSettings);
router.put("/:id", validate(updateVendorSettingsSchema), updateVendorSettings);

export default router;