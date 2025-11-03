import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { VendorSettings, VendorDetails, VendorLanguagePair, VendorService, VendorSpecialization } = db;

const VENDOR_SETTINGS_ALLOWED_FIELDS = [
  "works_with_all_services",
  "works_with_all_language_pairs",
  "works_with_all_specializations",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Duplicate entry" },
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

// Get
export const getVendorSettings = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendor = await VendorDetails.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This vendor doesn't belong to your admin account",
      });
    }

    let settings = await VendorSettings.findOne({ where: { vendor_id: id } });

    if (!settings) {
      return res.status(403).json({
        success: false,
        message: "No settings for this vendor.",
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Update
export const updateVendorSettings = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_SETTINGS_ALLOWED_FIELDS);

    const vendor = await VendorDetails.findByPk(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This vendor doesn't belong to your admin account",
      });
    }

    let settings = await VendorSettings.findOne({ where: { vendor_id: id } });

    if (!settings) {
      return res.status(403).json({
        success: false,
        message: "No settings for this vendor.",
      });
    }

    await settings.update(data);

    const {
      works_with_all_services,
      works_with_all_language_pairs,
      works_with_all_specializations,
    } = settings;

    if (works_with_all_services === true) {
      await VendorService.destroy({ where: { vendor_id: id } });
      console.log(`Deleted vendor_services for vendor_id=${id}`);
    }

    if (works_with_all_language_pairs === true) {
      await VendorLanguagePair.destroy({ where: { vendor_id: id } });
      console.log(`Deleted vendor_language_pairs for vendor_id=${id}`);
    }

    if (works_with_all_specializations === true) {
      await VendorSpecialization.destroy({ where: { vendor_id: id } });
      console.log(`Deleted vendor_specializations for vendor_id=${id}`);
    }

    res.json({
      success: true,
      message: "Vendor settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};