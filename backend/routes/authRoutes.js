import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  getCurrentUser
} from "../controllers/admin/authController.js";
import { validateSignup } from "../middlewares/validateSignup.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { markSetupCompleted } from "../controllers/admin/adminSetupController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.patch("/setup-completed", authenticateToken, markSetupCompleted);

export default router;
