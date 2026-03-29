import bcrypt from "bcryptjs";
import db from "../../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils.js";

const { AdminAuth, AdminDetails, UserRoles, Roles } = db;

export const activateAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { username, password } = req.body;

    const adminAuth = await AdminAuth.findOne({
      where: { activation_token: token },
      include: [
        {
          model: UserRoles,
          as: "role",
          include: [
            {
              model: Roles,
              as: "role_details",
              attributes: ["name", "slug"],
            },
          ],
        },
      ],
    });

    if (!adminAuth) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (adminAuth.is_active) {
      return res
        .status(400)
        .json({ error: "Account already activated. Please login." });
    }

    // Verify this is actually an admin activation link
    const roleSlug = adminAuth.role?.role_details?.slug;
    if (roleSlug !== "administrator") {
      return res.status(403).json({ error: "Invalid activation link" });
    }

    const existingUsername = await AdminAuth.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const adminDetails = await AdminDetails.findOne({
      where: { admin_id: adminAuth.id },
    });

    if (!adminDetails) {
      return res.status(500).json({ error: "No account details found." });
    }

    const password_hash = await bcrypt.hash(password, 12);

    adminAuth.username = username;

    adminAuth.password_hash = password_hash;
    adminAuth.is_active = true;
    adminAuth.activation_token = null;

    const roleEntry = adminAuth.role.role_details;
    const accessToken = generateAccessToken(adminAuth, roleEntry.name, roleEntry.slug);
    const refreshToken = generateRefreshToken(adminAuth);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    adminAuth.refresh_token = refreshToken;
    adminAuth.refresh_token_expiry = expiryDate;

    await adminAuth.save();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Account activated & logged in successfully",
      role: roleEntry.slug,
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

    return res.status(200).json({
      valid: true,
      is_active: adminAuth.is_active,
    });
  } catch (err) {
    next(err);
  }
};