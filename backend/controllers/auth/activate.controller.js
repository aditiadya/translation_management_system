import bcrypt from "bcryptjs";
import db from "../../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils.js";

const { AdminAuth, AdminDetails } = db;

export const activateAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { username, password } = req.body;

    const adminAuth = await AdminAuth.findOne({
      where: { activation_token: token },
    });

    if (!adminAuth) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (adminAuth.is_active) {
      return res
        .status(400)
        .json({ error: "Account already activated. Please login." });
    }

    const existingUsername = await AdminDetails.findOne({
      where: { username },
    });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const adminDetails = await AdminDetails.findOne({
      where: { admin_id: adminAuth.id },
    });

    if (!adminDetails) {
      return res.status(500).json({ error: "No account detected." });
    }

    adminDetails.username = username;
    await adminDetails.save();

    adminAuth.password_hash = password_hash;
    adminAuth.is_active = true;
    adminAuth.activation_token = null;
    await adminAuth.save();

    // Auto login after activation
    const accessToken = generateAccessToken(adminAuth);
    const refreshToken = generateRefreshToken(adminAuth);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    adminAuth.refresh_token = refreshToken;
    adminAuth.refresh_token_expiry = expiryDate;

    await adminAuth.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Account activated & logged in successfully",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyActivationToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const adminAuth = await AdminAuth.findOne({
      where: { activation_token: token },
    });

    if (!adminAuth) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired token" });
    }

    if (adminAuth.is_active) {
      return res.status(200).json({ valid: true, is_active: true });
    }

    return res.status(200).json({ valid: true, is_active: false });
  } catch (err) {
    next(err);
  }
};