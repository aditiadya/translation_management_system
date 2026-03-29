import crypto from "crypto";
import db from "../../models/index.js";

const { AdminAuth, VendorDetails, UserRoles, Roles } = db;

/**
 * inviteVendor
 *
 * Admin-only. Creates a vendor auth record in AdminAuth (the shared
 * auth table), assigns the vendor role via UserRoles, and creates
 * the VendorDetails stub. Sends an activation token to the vendor.
 *
 * Route:  POST /vendor/invite
 * Access: authenticateToken + requireRole("admin")
 */
export const inviteVendor = async (req, res, next) => {
  try {
    const adminId = req.user.id;

    const {
      email,
      type,
      legal_entity,
      country,
      company_name,
      state_region,
      city,
      postal_code,
      address,
      pan_tax_number,
      gstin_vat_number,
      website,
      note,
    } = req.body;

    // Email must be unique across ALL roles (same auth table)
    const existing = await AdminAuth.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const vendorRole = await Roles.findOne({ where: { slug: "vendor" } });
    if (!vendorRole) {
      console.error("[INVITE] Vendor role not found. Run roles seeder first.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const activationToken = crypto.randomBytes(32).toString("hex");

    // Create auth record (inactive until vendor activates)
    const vendorAuth = await AdminAuth.create({
      email,
      activation_token: activationToken,
      is_active: false,
    });

    // Assign vendor role
    await UserRoles.create({
      auth_id: vendorAuth.id,
      role_id: vendorRole.id,
    });

    // Create vendor profile stub
    // auth_id  = vendor's own auth row
    // admin_id = the admin who created this vendor
    await VendorDetails.create({
      auth_id: vendorAuth.id,
      admin_id: adminId,
      type,
      legal_entity,
      country,
      company_name: company_name ?? null,
      state_region: state_region ?? null,
      city: city ?? null,
      postal_code: postal_code ?? null,
      address: address ?? null,
      pan_tax_number: pan_tax_number ?? null,
      gstin_vat_number: gstin_vat_number ?? null,
      website: website ?? null,
      note: note ?? null,
      can_login: false,
    });

    console.log(
      `[AUDIT] Vendor invited: ${email} by admin ${adminId} at ${new Date().toISOString()}`
    );
    // TODO: send activationToken via email to vendor
    console.log("Activation token (send via email):", activationToken);

    res.status(200).json({
      message: "Vendor invited successfully. Activation email will be sent.",
      activationToken, // remove once email is wired up
    });
  } catch (err) {
    console.error("inviteVendor error:", err);
    next(err);
  }
};