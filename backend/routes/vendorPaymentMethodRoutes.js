import express from "express";
import {
  addVendorPaymentMethod,
  getVendorPaymentMethods,
  updateVendorPaymentMethod,
  deleteVendorPaymentMethod,
} from "../controllers/vendor/vendorPaymentMethods.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  addVendorPaymentMethodSchema,
  updateVendorPaymentMethodSchema,
  getVendorPaymentMethodsSchema,
  deleteVendorPaymentMethodSchema,
} from "../validators/vendorPaymentMethods.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(addVendorPaymentMethodSchema), addVendorPaymentMethod);
router.get("/:vendor_id", validate(getVendorPaymentMethodsSchema), getVendorPaymentMethods);
router.put("/:id", validate(updateVendorPaymentMethodSchema), updateVendorPaymentMethod);
router.delete("/:id", validate(deleteVendorPaymentMethodSchema), deleteVendorPaymentMethod);

export default router;
