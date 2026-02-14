import express from "express";
import {
  createVendorService,
  updateVendorService,
  getVendorServiceById,
  getAllVendorServices,
  deleteVendorService,
  getVendorServicesForVendor,
  getAdminServicesForVendor,
  initializeVendorServices, // ADD THIS LINE
} from "../controllers/vendor/vendorServices.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorServiceSchema,
  updateVendorServiceSchema,
  getVendorServiceSchema,
  deleteVendorServiceSchema,
  getAllVendorServicesSchema,
  getVendorServicesForVendorSchema,
  getAdminServicesForVendorSchema,
  initializeVendorServicesSchema, // ADD THIS LINE
} from "../validators/vendorServices.schema.js";

const router = express.Router();

router.use(authenticateToken);

// ADD THIS ROUTE - MUST BE BEFORE OTHER POST ROUTES
router.post("/initialize", validate(initializeVendorServicesSchema), initializeVendorServices);

router.post("/", validate(createVendorServiceSchema), createVendorService);
router.put("/:id", validate(updateVendorServiceSchema), updateVendorService);
router.get("/:id", validate(getVendorServiceSchema), getVendorServiceById);
router.get("/", validate(getAllVendorServicesSchema), getAllVendorServices);
router.get("/:id/services", validate(getVendorServicesForVendorSchema), getVendorServicesForVendor);
router.delete("/:id", validate(deleteVendorServiceSchema), deleteVendorService);
router.get("/:id/admin-services", validate(getAdminServicesForVendorSchema), getAdminServicesForVendor);

export default router;
