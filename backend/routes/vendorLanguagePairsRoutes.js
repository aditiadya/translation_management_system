import express from "express";
import {
  createVendorLanguagePair,
  updateVendorLanguagePair,
  getVendorLanguagePairById,
  getAllVendorLanguagePairs,
  deleteVendorLanguagePair,
  getVendorLanguagePairsForVendor,
  getAdminLanguagePairsForVendor,
  bulkDeleteVendorLanguagePairs,
  initializeVendorLanguagePairs,
  // bulkCreateVendorLanguagePairs, // Add this if you create a separate function
} from "../controllers/vendor/vendorLanguagePairs.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorLanguagePairSchema,
  updateVendorLanguagePairSchema,
  getVendorLanguagePairSchema,
  deleteVendorLanguagePairSchema,
  getAllVendorLanguagePairsSchema,
  getVendorLanguagePairsForVendorSchema,
  bulkCreateVendorLanguagePairSchema,
  bulkDeleteVendorLanguagePairSchema,
  getAdminLanguagePairsForVendorSchema,
  initializeVendorLanguagePairsSchema,
} from "../validators/vendorLanguagePair.schema.js";

const router = express.Router();

router.use(authenticateToken);

// Bulk operations should come BEFORE parameterized routes
router.post("/bulk-create", validate(bulkCreateVendorLanguagePairSchema), createVendorLanguagePair);
router.post("/bulk-delete", validate(bulkDeleteVendorLanguagePairSchema), bulkDeleteVendorLanguagePairs);

// Single operations
router.post("/", validate(createVendorLanguagePairSchema), createVendorLanguagePair);
router.put("/:id", validate(updateVendorLanguagePairSchema), updateVendorLanguagePair);
router.get("/", validate(getAllVendorLanguagePairsSchema), getAllVendorLanguagePairs);
router.get("/:id", validate(getVendorLanguagePairSchema), getVendorLanguagePairById);
router.get("/:id/language-pairs", validate(getVendorLanguagePairsForVendorSchema), getVendorLanguagePairsForVendor);
router.get("/:id/admin-pairs", validate(getAdminLanguagePairsForVendorSchema), getAdminLanguagePairsForVendor);
router.delete("/:id", validate(deleteVendorLanguagePairSchema), deleteVendorLanguagePair);
router.post("/initialize", validate(initializeVendorLanguagePairsSchema), initializeVendorLanguagePairs);

export default router;
