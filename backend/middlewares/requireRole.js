export const ADMIN = ["administrator"];

export const MANAGERS = [
  "operations_manager",
  "account_manager",
  "project_manager",
  "sales_manager",
  "vendor_manager",
  "finance_manager",
  "accountant",
  "office_admin",
  "language_quality_manager",
  "language_lead",
];

export const ADMIN_AND_MANAGERS = [...ADMIN, ...MANAGERS];

export const VENDOR = ["vendor"];

export const CLIENT = ["client"];

export const requireRole = (...allowedSlugs) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleSlug) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!allowedSlugs.includes(req.user.roleSlug)) {
      return res.status(403).json({
        error: "Access denied",
        required: allowedSlugs,
        current: req.user.roleSlug,
      });
    }

    next();
  };
};

import db from "../models/index.js";
const { AdminSetup } = db;

// Blocks administrator from accessing operational endpoints until setup is complete.
// Non-admin roles pass through immediately.
export const requireSetupCompleted = async (req, res, next) => {
  if (req.user?.roleSlug !== "administrator") return next();

  try {
    const setup = await AdminSetup.findOne({ where: { admin_id: req.user.id } });
    if (!setup?.setup_completed) {
      return res.status(403).json({
        error: "Setup not completed. Please finish the initial system setup before accessing this resource.",
      });
    }
    next();
  } catch (err) {
    console.error("requireSetupCompleted error:", err);
    return res.status(500).json({ error: "Failed to verify setup status." });
  }
};