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

router.post("/", authenticateToken, createVendorPrice);
router.get("/", authenticateToken, getAllVendorPrices);
router.get("/:id", authenticateToken, getVendorPriceById);
router.put("/:id", authenticateToken, updateVendorPrice);
router.delete("/:id", authenticateToken, deleteVendorPrice);

export default router;
