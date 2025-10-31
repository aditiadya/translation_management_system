import express from "express";
import {
  createVendorService,
  updateVendorService,
  getVendorServiceById,
  getAllVendorServices,
  deleteVendorService,
} from "../controllers/vendor/vendorServices.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorServiceSchema,
  updateVendorServiceSchema,
  getVendorServiceSchema,
  deleteVendorServiceSchema,
  getAllVendorServicesSchema,
} from "../validators/vendorServices.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createVendorServiceSchema), createVendorService);
router.put("/:id", validate(updateVendorServiceSchema), updateVendorService);
router.get("/:id", validate(getVendorServiceSchema), getVendorServiceById);
router.get("/", validate(getAllVendorServicesSchema), getAllVendorServices);
router.delete("/:id", validate(deleteVendorServiceSchema), deleteVendorService);

export default router;