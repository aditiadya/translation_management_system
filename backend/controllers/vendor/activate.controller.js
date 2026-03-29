import bcrypt from "bcryptjs";
import db from "../../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils.js";

const { AdminAuth, VendorDetails, VendorPrimaryUserDetails, UserRoles, Roles } = db;

/**
 * activateVendorAccount
 *
 * Vendor clicks invite link → sets password → auto-logged in.
 * Verifies the token belongs to a vendor role before proceeding
 * so admin activation links can't be used here and vice versa.
 *
 * Route:  POST /vendor/activate/:token
 * Access: public
 */
export const activateVendorAccount = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { username, password, first_name, last_name, timezone } = req.body;

    const vendorAuth = await AdminAuth.findOne({
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
        {
          model: VendorDetails,
          as: "vendor",
          include: [
            {
              model: VendorPrimaryUserDetails,
              as: "primary_users",
            },
          ],
        },
      ],
    });

    if (!vendorAuth) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (vendorAuth.is_active) {
      return res
        .status(400)
        .json({ error: "Account already activated. Please login." });
    }

    // Guard: ensure this token belongs to a vendor, not any other role
    const roleSlug = vendorAuth.role?.role_details?.slug;
    if (roleSlug !== "vendor") {
      return res.status(403).json({ error: "Invalid activation link" });
    }

    // Check if username already exists in AdminAuth
    const existingUsername = await AdminAuth.findOne({
      where: { username },
    });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Update VendorPrimaryUserDetails with other editable fields
    const vendorDetails = vendorAuth.vendor;
    if (vendorDetails && vendorDetails.primary_users) {
      const primaryUser = vendorDetails.primary_users;
      
      if (first_name) primaryUser.first_name = first_name;
      if (last_name) primaryUser.last_name = last_name;
      if (timezone) primaryUser.timezone = timezone;
      
      await primaryUser.save();
    }

    const password_hash = await bcrypt.hash(password, 12);

    vendorAuth.username = username;
    vendorAuth.password_hash = password_hash;
    vendorAuth.is_active = true;
    vendorAuth.activation_token = null;
    await VendorDetails.update(
      { can_login: true },
      { where: { auth_id: vendorAuth.id } }
    );

    const roleEntry = vendorAuth.role.role_details;
    const accessToken = generateAccessToken(vendorAuth, roleEntry.name, roleEntry.slug);
    const refreshToken = generateRefreshToken(vendorAuth);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    vendorAuth.refresh_token = refreshToken;
    vendorAuth.refresh_token_expiry = expiryDate;

    await vendorAuth.save();

    console.log(
      `[AUDIT] Vendor activated: ${vendorAuth.email} at ${new Date().toISOString()}`
    );

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

/**
 * verifyVendorActivationToken
 * Frontend calls this before showing the activation form.
 * Returns pre-filled data: first_name, last_name, timezone
 */
export const verifyVendorActivationToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    const vendorAuth = await AdminAuth.findOne({
      where: { activation_token: token },
      include: [
        {
          model: UserRoles,
          as: "role",
          include: [
            {
              model: Roles,
              as: "role_details",
              attributes: ["slug"],
            },
          ],
        },
        {
          model: VendorDetails,
          as: "vendor",
          include: [
            {
              model: VendorPrimaryUserDetails,
              as: "primary_users",
              attributes: ["first_name", "last_name", "timezone"],
            },
          ],
        },
      ],
    });

    if (!vendorAuth) {
      return res
        .status(400)
        .json({ valid: false, error: "Invalid or expired token" });
    }

    const roleSlug = vendorAuth.role?.role_details?.slug;
    if (roleSlug !== "vendor") {
      return res
        .status(403)
        .json({ valid: false, error: "Invalid activation link" });
    }

    // Fetch pre-filled data from vendor primary user details
    const primaryUser = vendorAuth.vendor?.primary_users;

    return res.status(200).json({
      valid: true,
      is_active: vendorAuth.is_active,
      email: vendorAuth.email,
      pre_filled: {
        first_name: primaryUser?.first_name || "",
        last_name: primaryUser?.last_name || "",
        timezone: primaryUser?.timezone || "",
      },
    });
  } catch (err) {
    next(err);
  }
};