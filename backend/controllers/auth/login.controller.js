import bcrypt from "bcryptjs";
import db from "../../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils.js";

const { AdminAuth, AdminDetails, UserRoles, Roles } = db;

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // Try email first
    let user = await AdminAuth.findOne({
      where: { email: identifier },
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
      user = await AdminAuth.findOne({
        where: { username: identifier },
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
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "Account is not activated" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const roleEntry = user.role?.role_details;
    if (!roleEntry) {
      console.error(`[AUTH] User ${user.id} has no role assigned`);
      return res.status(500).json({ error: "User account has no role assigned" });
    }

    const accessToken = generateAccessToken(user, roleEntry.name, roleEntry.slug);
    const refreshToken = generateRefreshToken(user);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await user.update({
      refresh_token: refreshToken,
      refresh_token_expiry: expiryDate,
    });

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
      message: "Login successful",
      role: roleEntry.slug,
    });
  } catch (err) {
    next(err);
  }
};