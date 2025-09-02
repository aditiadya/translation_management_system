import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import AdminAuth from "../../models/adminAuth.js";

const TOKEN_EXPIRY_MINUTES = 30;

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await AdminAuth.findOne({ where: { email } });

    if (!admin) {
      return res.status(200).json({
        message: "If this email exists, reset instructions have been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiryDate = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await admin.update({
      reset_token: hashedToken,
      reset_token_expiry: expiryDate,
    });

    console.log(`[AUDIT] Password reset requested for ${email} at ${new Date().toISOString()}`);
    console.log("Raw reset token (send via email):", resetToken);

    return res.json({
      message: "If this email exists, reset instructions have been sent.",
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await AdminAuth.findOne({
      where: {
        reset_token: hashedToken,
        reset_token_expiry: { [Op.gt]: new Date() },
      },
    });

    if (!admin) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await admin.update({
      password_hash: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    });

    console.log(`[AUDIT] Password reset successful for ${admin.email} at ${new Date().toISOString()}`);

    return res.json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
