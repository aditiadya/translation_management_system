import express from "express";
import {
  getSelfVendorDetails,
  updateSelfVendorDetails,
} from "../controllers/vendor/vendorDetails.js";
import { validate } from "../middlewares/validate.js";
import {
  getVendorSchema,
  updateVendorSchema,
} from "../validators/vendor.schema.js";

const router = express.Router();
router.use((req, res, next) => {
  next();
});

router.get("/", getSelfVendorDetails);
router.put("/", validate(updateVendorSchema), updateSelfVendorDetails);

export default router;
