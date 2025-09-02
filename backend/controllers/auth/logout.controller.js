import db from "../../models/index.js";
const { AdminAuth} = db;

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
