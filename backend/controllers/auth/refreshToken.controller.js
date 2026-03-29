import jwt from "jsonwebtoken";
import db from "../../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils.js";

const { AdminAuth, UserRoles, Roles } = db;

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
      include: [
        {
          model: UserRoles,
          as: "role",
          include: [
            {
              model: Roles,
              as: "role_details",
              attributes: ["id", "name", "slug"],
            },
          ],
        },
      ],
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

    const roleEntry = user.role?.role_details;
    if (!roleEntry) {
      console.error(`[AUTH] User ${user.id} has no role during token refresh`);
      return res.status(500).json({ error: "User account has no role assigned" });
    }

    const newAccessToken = generateAccessToken(user, roleEntry.name, roleEntry.slug);

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

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    next(err);
  }
};