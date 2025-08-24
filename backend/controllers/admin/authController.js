import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Op } from "sequelize";
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
      accepted_at: new Date(),
    });

    await AdminDetails.create({
      id: adminAuth.id,
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
      where: { id: adminAuth.id },
    });

    if (adminDetails) {
      adminDetails.username = username;
      await adminDetails.save();
    } else {
      await AdminDetails.create({
        id: adminAuth.id,
        username,
        account_type: "enterprise",
        country: "Unknown",
        time_zone: "UTC",
        first_name: "N/A",
        last_name: "N/A",
        phone: "N/A",
      });
    }

    adminAuth.password_hash = password_hash;
    adminAuth.is_active = true;
    adminAuth.activation_token = null;
    await adminAuth.save();

    const fakeReq = {
      body: {
        identifier: username,
        password,
      },
      cookies: req.cookies,
    };

    const fakeRes = {
      cookie: res.cookie.bind(res), 
      status: (code) => {
        fakeRes.statusCode = code;
        return fakeRes;
      },
      json: (data) => res.status(fakeRes.statusCode || 200).json(data),
    };

    await login(fakeReq, fakeRes, next);

    res.status(200).json({ message: "Account activated successfully" });
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

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

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

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }

      const user = await AdminAuth.findByPk(decoded.userId, {
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

      const response = {
        id: user.id,
        email: user.email,
        is_active: user.is_active,
        setup_completed: user.profile?.setup_completed || false,
      };

      res.json(response);
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
    if (!token)
      return res.status(401).json({ error: "Refresh token required" });

    const user = await AdminAuth.findOne({ where: { refresh_token: token } });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    await user.update({ refresh_token: null, refresh_token_expiry: null });

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
