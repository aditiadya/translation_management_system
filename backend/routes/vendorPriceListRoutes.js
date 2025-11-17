import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
// import { validate } from "../middlewares/validate.js";
// import {
//   createVendorPriceSchema,
//   updateVendorPriceSchema,
// } from "../validators/vendor/vendorPriceListValidator.js";
import {
  createVendorPrice,
  getAllVendorPrices,
  getVendorPriceById,
  updateVendorPrice,
  deleteVendorPrice,
} from "../controllers/vendor/vendorPriceList.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createVendorPrice);
router.get("/", getAllVendorPrices);
router.get("/:id", getVendorPriceById);
router.put("/:id", updateVendorPrice);
router.delete("/:id", deleteVendorPrice);

export default router;
