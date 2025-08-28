import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../../models/index.js";
const { AdminAuth, AdminDetails, AdminProfile, AdminTerms } = db;
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils.js";

// Signup controller
export const signup = async (req, res, next) => {
  try {
    const {
      email,
      account_type,
      company_name,
      country,
      time_zone,
      first_name,
      last_name,
      phone,
      terms_accepted,
    } = req.body;

    const existing = await AdminAuth.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (!terms_accepted) {
      return res
        .status(400)
        .json({ error: "You must accept the terms and conditions" });
    }

    const activationToken = crypto.randomBytes(32).toString("hex");

    const adminAuth = await AdminAuth.create({
      email,
      activation_token: activationToken,
      is_active: false,
    });

    await AdminProfile.create({
      admin_id: adminAuth.id,
    });

    await AdminTerms.create({
      admin_id: adminAuth.id,
      terms_accepted: true,
    });

    await AdminDetails.create({
      admin_id: adminAuth.id,
      account_type,
      company_name: account_type === "enterprise" ? company_name : null,
      country,
      time_zone,
      first_name,
      last_name,
      phone,
    });

    res.status(200).json({
      message: "Account Registered Successfully. Activation needed!",
      activationToken,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    next(err);
  }
};

// Set username and password (Account Activation)
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

// Login Controller
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    let user = await AdminAuth.findOne({
      where: { email: identifier },
    });

    if (!user) {
      const details = await AdminDetails.findOne({
        where: { username: identifier },
        include: [{ model: AdminAuth, as: "auth" }],
      });

      if (details) {
        user = details.auth;
      }
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await user.update({
      refresh_token: refreshToken,
      refresh_token_expiry: expiryDate,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

// Refresh Token Controller
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET || "yourrefreshtokensecret"
      );
    } catch (e) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const user = await AdminAuth.findOne({
      where: { id: payload.userId, refresh_token: token },
    });
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const now = new Date();
    if (!user.refresh_token_expiry || user.refresh_token_expiry < now) {
      return res.status(403).json({ error: "Refresh token expired" });
    }

    const expiryDate = new Date(user.refresh_token_expiry);
    const needsRotation =
      expiryDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

    let newRefreshToken = token;
    let newExpiryDate = expiryDate;

    if (needsRotation) {
      newRefreshToken = generateRefreshToken(user);
      newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 7);

      await user.update({
        refresh_token: newRefreshToken,
        refresh_token_expiry: newExpiryDate,
      });
    }

    const newAccessToken = generateAccessToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (err) {
    next(err);
  }
};

// Current User Verification
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await AdminAuth.findByPk(req.user.id, {
      attributes: ["id", "email", "is_active"],
      include: [
        {
          model: AdminProfile,
          as: "profile",
          attributes: ["setup_completed"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      setup_completed: user.profile?.setup_completed || false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout Controller
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      return res.status(400).json({ error: "Refresh token required" });
    }

    const user = await AdminAuth.findOne({ where: { refresh_token: token } });

    if (user) {
      await user.update({ refresh_token: null, refresh_token_expiry: null });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
