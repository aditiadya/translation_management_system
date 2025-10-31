import express from "express";
import {
  createVendorLanguagePair,
  updateVendorLanguagePair,
  getVendorLanguagePairById,
  getAllVendorLanguagePairs,
  deleteVendorLanguagePair,
} from "../controllers/vendor/vendorLanguagePairs.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createVendorLanguagePairSchema,
  updateVendorLanguagePairSchema,
  getVendorLanguagePairSchema,
  deleteVendorLanguagePairSchema,
  getAllVendorLanguagePairsSchema,
} from "../validators/vendorLanguagePair.schema.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validate(createVendorLanguagePairSchema), createVendorLanguagePair);
router.put("/:id", validate(updateVendorLanguagePairSchema), updateVendorLanguagePair);
router.get("/:id", validate(getVendorLanguagePairSchema), getVendorLanguagePairById);
router.get("/", validate(getAllVendorLanguagePairsSchema), getAllVendorLanguagePairs);
router.delete("/:id", validate(deleteVendorLanguagePairSchema), deleteVendorLanguagePair);

export default router;
