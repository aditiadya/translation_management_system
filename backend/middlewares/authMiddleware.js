import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { AdminAuth } = db;

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "yoursecret"
      );
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Access token expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }


    const user = await AdminAuth.findByPk(decoded.userId, {
      attributes: ["id", "email", "is_active"],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "Account is inactive" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: decoded.role,       
      roleSlug: decoded.roleSlug, 
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

export const authenticateLogout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "yourrefreshtokensecret"
      );
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Refresh token expired" });
      }
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await AdminAuth.findByPk(decoded.userId, {
      attributes: ["id", "email", "is_active"],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};