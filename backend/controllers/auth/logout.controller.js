import db from "../../models/index.js";

const { AdminAuth } = db;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    const clearCookies = () => {
      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
    };

    if (!token) {
      clearCookies();
      return res.status(400).json({ error: "Refresh token required" });
    }

    const user = await AdminAuth.findOne({ where: { refresh_token: token } });

    if (user) {
      await user.update({
        refresh_token: null,
        refresh_token_expiry: null,
      });
    }

    clearCookies();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};