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
      return res.status(404).json({
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
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_SETTINGS_ALLOWED_FIELDS);

    const vendor = await VendorDetails.findByPk(id, { transaction });
    if (!vendor) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Access denied: This vendor doesn't belong to your admin account",
      });
    }

    let settings = await VendorSettings.findOne({
      where: { vendor_id: id },
      transaction,
    });

    if (!settings) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "No settings for this vendor.",
      });
    }

    // Store OLD values BEFORE updating
    const oldWorksWithAllServices = settings.works_with_all_services;
    const oldWorksWithAllLanguagePairs = settings.works_with_all_language_pairs;
    const oldWorksWithAllSpecializations = settings.works_with_all_specializations;

    // Update settings
    await settings.update(data, { transaction });

    // Only delete if toggling FROM false TO true (disable → enable)
    if (data.works_with_all_services === true && oldWorksWithAllServices === false) {
      await VendorService.destroy({ where: { vendor_id: id }, transaction });
      console.log(`Deleted vendor_services for vendor_id=${id} (toggled to enabled)`);
    }

    if (data.works_with_all_language_pairs === true && oldWorksWithAllLanguagePairs === false) {
      await VendorLanguagePair.destroy({ where: { vendor_id: id }, transaction });
      console.log(`Deleted vendor_language_pairs for vendor_id=${id} (toggled to enabled)`);
    }

    if (data.works_with_all_specializations === true && oldWorksWithAllSpecializations === false) {
      await VendorSpecialization.destroy({ where: { vendor_id: id }, transaction });
      console.log(`Deleted vendor_specializations for vendor_id=${id} (toggled to enabled)`);
    }

    await transaction.commit();

    res.json({
      success: true,
      message: "Vendor settings updated successfully",
      data: settings,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};
