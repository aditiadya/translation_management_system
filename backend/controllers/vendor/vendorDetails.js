import crypto from "crypto";
import db from "../../models/index.js";
const { AdminAuth, VendorDetails, VendorPrimaryUserDetails } = db;
import { pickAllowed } from "../../utils/pickAllowed.js";

const VENDOR_ALLOWED_FIELDS = [
  "email",
  "type",
  "company_name",
  "legal_entity",
  "country",
  "state_region",
  "city",
  "postal_code",
  "address",
  "pan_tax_number",
  "gstin_vat_number",
  "website",
  "note",
  "first_name",
  "last_name",
  "timezone",
  "phone",
  "zoom_id",
  "teams_id",
  "gender",
  "nationality",
  "can_login",
  "assignable_to_jobs",
  "finances_visible",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Email already exists" },
    };
  }
  if (error?.name === "SequelizeValidationError") {
    return {
      code: 400,
      body: {
        success: false,
        message: "Invalid data",
        details: error.errors?.map((e) => e.message),
      },
    };
  }
  return {
    code: 500,
    body: { success: false, message: "Server error" },
  };
};

// Add
export const createVendor = async (req, res) => {
  const adminId = req.user.id;
  const data = pickAllowed(req.body, VENDOR_ALLOWED_FIELDS);

  try {
    const activationToken = data.can_login
      ? crypto.randomBytes(32).toString("hex")
      : null;

    console.log("REQ.BODY:", req.body);
    console.log("DATA AFTER pickAllowed:", data);
    console.log("EMAIL PASSED TO ADMINAUTH:", data.email);

    const vendorAuth = await AdminAuth.create({
      email: data.email,
      activation_token: activationToken,
    });

    const vendorDetails = await VendorDetails.create({
      auth_id: vendorAuth.id,
      admin_id: adminId,
      type: data.type,
      company_name: data.company_name,
      legal_entity: data.legal_entity,
      country: data.country,
      state_region: data.state_region,
      city: data.city,
      postal_code: data.postal_code,
      address: data.address,
      pan_tax_number: data.pan_tax_number,
      gstin_vat_number: data.gstin_vat_number,
      website: data.website,
      note: data.note,
      can_login: data.can_login,
      assignable_to_jobs: data.assignable_to_jobs,
      finances_visible: data.finances_visible,
    });

    await VendorPrimaryUserDetails.create({
      vendor_id: vendorDetails.id,
      first_name: data.first_name,
      last_name: data.last_name,
      timezone: data.timezone,
      phone: data.phone,
      zoom_id: data.zoom_id,
      teams_id: data.teams_id,
      gender: data.gender,
      nationality: data.nationality,
    });

    let activationLink = null;
    if (data.can_login) {
      activationLink = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/activate/${activationToken}`;
    }

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      activationLink,
    });
  } catch (err) {
    console.error(err);
    const errorResponse = toClientError(err);
    return res.status(errorResponse.code).json(errorResponse.body);
  }
};

// Update
export const updateVendor = async (req, res) => {
  const vendorId = req.params.id;
  const adminId = req.user.id;

  try {
    const vendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
    });

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found." });
    }

    if (req.body.email) {
      const auth = await AdminAuth.findByPk(vendor.auth_id);

      if (auth) {
        auth.email = req.body.email;
        await auth.save();
      }
    }

    const vendorFields = [
      "type",
      "company_name",
      "legal_entity",
      "country",
      "state_region",
      "city",
      "postal_code",
      "address",
      "pan_tax_number",
      "gstin_vat_number",
      "website",
      "note",
      "can_login",
      "assignable_to_jobs",
      "finances_visible",
    ];

    vendorFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        vendor[field] = req.body[field];
      }
    });

    await vendor.save();

    let primaryUser = await VendorPrimaryUserDetails.findOne({
      where: { vendor_id: vendorId },
    });

    const primaryUserFields = [
      "first_name",
      "last_name",
      "timezone",
      "phone",
      "zoom_id",
      "teams_id",
      "gender",
      "nationality"
    ];

    if (primaryUser) {
      primaryUserFields.forEach((field) => {
        if (req.body.hasOwnProperty(field)) {
          primaryUser[field] = req.body[field];
        }
      });

      await primaryUser.save();
    } else {
      const newPrimaryUserData = { vendor_id: vendorId };
      primaryUserFields.forEach((field) => {
        if (req.body.hasOwnProperty(field)) {
          newPrimaryUserData[field] = req.body[field];
        }
      });

      primaryUser = await VendorPrimaryUserDetails.create(newPrimaryUserData);
    }

    const updatedVendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: VendorPrimaryUserDetails, as: "primary_users" },
      ],
    });

    return res.status(200).json({ success: true, data: updatedVendor });
  } catch (error) {
    console.error("UPDATE VENDOR ERROR:", error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get vendor by ID
export const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  const adminId = req.user.id;

  try {
    const vendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: VendorPrimaryUserDetails, as: "primary_users" },
      ],
    });

    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "No vendor found." });

    return res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
  const adminId = req.user.id;

  try {
    const vendors = await VendorDetails.findAll({
      where: { admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: VendorPrimaryUserDetails, as: "primary_users" },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ success: true, data: vendors });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete
export const deleteVendor = async (req, res) => {
  const vendorId = req.params.id;
  const adminId = req.user.id;

  try {
    const vendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
    });

    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "No vendor found." });

    await VendorPrimaryUserDetails.destroy({ where: { vendor_id: vendorId } });
    await AdminAuth.destroy({ where: { id: vendor.auth_id } });
    await VendorDetails.destroy({ where: { id: vendorId } });

    return res
      .status(200)
      .json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};