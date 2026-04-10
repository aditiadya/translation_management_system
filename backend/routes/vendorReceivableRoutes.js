import express from "express";
import { getVendorReceivables, getVendorReceivableById } from "../controllers/vendor/vendorReceivables.js";

const router = express.Router();

router.get("/", getVendorReceivables);
router.get("/:id", getVendorReceivableById);

export default router;
