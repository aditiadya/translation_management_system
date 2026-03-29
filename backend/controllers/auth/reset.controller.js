import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import db from "../../models/index.js";

const { AdminAuth } = db;

const TOKEN_EXPIRY_MINUTES = 30;

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await AdminAuth.findOne({ where: { email } });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const expiryDate = new Date(
        Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000
      );

      await user.update({
        reset_token: hashedToken,
        reset_token_expiry: expiryDate,
      });

      console.log(
        `[AUDIT] Password reset requested for ${email} at ${new Date().toISOString()}`
      );
      console.log("Raw reset token (send via email):", resetToken);
    }

    return res.status(200).json({
      message: "If this email exists, reset instructions have been sent.",
    });
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await AdminAuth.findOne({
      where: {
        reset_token: hashedToken,
        reset_token_expiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.update({
      password_hash: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    });

    console.log(
      `[AUDIT] Password reset successful for ${user.email} at ${new Date().toISOString()}`
    );

    return res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await AdminAuth.findByPk(userId, {
      attributes: ["id", "email", "password_hash"],
    });

    if (!user) {
      return res.status(404).json({ error: "Account not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    const isSame = await bcrypt.compare(newPassword, user.password_hash);
    if (isSame) {
      return res.status(400).json({
        error: "New password must be different from the current password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash: hashedPassword });

    console.log(
      `[AUDIT] Password changed for ${user.email} at ${new Date().toISOString()}`
    );

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};