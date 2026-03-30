import express from "express";
import {
  inviteVendor,
  activateVendorAccount,
  verifyVendorActivationToken,
} from "../controllers/vendor/index.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { requireRole, ADMIN } from "../middlewares/requireRole.js";
import { validateVendorActivation } from "../middlewares/validateVendorActivation.js";

const router = express.Router();

router.get("/activate/:token/verify", verifyVendorActivationToken);
router.post("/activate/:token", validateVendorActivation, activateVendorAccount);

router.post(
  "/invite",
  authenticateToken,
  requireRole(...ADMIN),
  inviteVendor
);

export default router;