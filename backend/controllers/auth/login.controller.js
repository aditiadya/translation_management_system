import bcrypt from "bcryptjs";
import db from "../../models/index.js";
const { AdminAuth, AdminDetails } = db;
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils.js";

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