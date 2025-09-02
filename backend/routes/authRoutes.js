import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  activateAccount,
  verifyActivationToken,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth/index.js";
import { validateSignup } from "../middlewares/validateSignup.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { validateActivation } from "../middlewares/validateActivation.js";
import { markSetupCompleted } from "../controllers/admin/adminSetupController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { requestResetSchema, resetPasswordSchema } from "../validators/resetPassword.schema.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticateToken, getCurrentUser);
router.patch("/setup-completed", authenticateToken, markSetupCompleted);
router.post('/activate/:token', validateActivation, activateAccount);
router.get("/activate/:token/verify", verifyActivationToken);
router.post("/request-reset", validate(requestResetSchema), requestPasswordReset);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
