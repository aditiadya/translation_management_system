import crypto from "crypto";
import db from "../../models/index.js";

const { AdminAuth, AdminDetails, AdminSetup, AdminTerms } = db;

export const signup = async (req, res, next) => {
  try {
    const {
      email,
      account_type,
      company_name,
      country,
      time_zone,
      first_name,
      last_name,
      phone,
      terms_accepted,
    } = req.body;

    const existing = await AdminAuth.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (!terms_accepted) {
      return res
        .status(400)
        .json({ error: "You must accept the terms and conditions" });
    }

    const activationToken = crypto.randomBytes(32).toString("hex");

    const adminAuth = await AdminAuth.create({
      email,
      activation_token: activationToken,
      is_active: false,
    });

    await AdminSetup.create({
      admin_id: adminAuth.id,
    });

    await AdminTerms.create({
      admin_id: adminAuth.id,
      terms_accepted: true,
    });

    await AdminDetails.create({
      admin_id: adminAuth.id,
      account_type,
      company_name: account_type === "enterprise" ? company_name : null,
      country,
      time_zone,
      first_name,
      last_name,
      phone,
    });

    res.status(200).json({
      message: "Account Registered Successfully. Activation needed!",
      activationToken,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    next(err);
  }
};
