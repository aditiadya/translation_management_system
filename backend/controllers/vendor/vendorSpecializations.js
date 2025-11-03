import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { VendorSpecialization, VendorDetails, AdminSpecialization, VendorSettings } = db;

const VENDOR_SPECIALIZATION_ALLOWED_FIELDS = ["vendor_id", "specialization_id"];

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

// Add
export const createVendorSpecialization = async (req, res) => {
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_SPECIALIZATION_ALLOWED_FIELDS);

    if (!data.vendor_id || !data.specialization_id) {
      return res.status(400).json({
        success: false,
        message: "vendor_id and specialization_id are required",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    const specialization = await AdminSpecialization.findByPk(
      data.specialization_id
    );

    if (!vendor || !specialization) {
      return res.status(404).json({
        success: false,
        message: "Vendor or Specialization not found",
      });
    }

    if (vendor.admin_id !== adminId || specialization.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message:
          "Vendor and Specialization must belong to the same admin account",
      });
    }

    const existing = await VendorSpecialization.findOne({
      where: {
        vendor_id: data.vendor_id,
        specialization_id: data.specialization_id,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This vendor-specialization mapping already exists",
      });
    }

    const newVendorSpecialization = await VendorSpecialization.create(data);
    res.status(201).json({
      success: true,
      message: "Vendor specialization created successfully",
      data: newVendorSpecialization,
    });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get all
export const getAllVendorSpecializations = async (req, res) => {
  try {
    const adminId = req.user.id;

    const vendorSpecializations = await VendorSpecialization.findAll({
      include: [
        {
          model: VendorDetails,
          as: "vendor",
          attributes: ["id", "company_name", "admin_id"],
          where: { admin_id: adminId },
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name", "admin_id"],
          where: { admin_id: adminId },
        },
      ],
    });

    res.json({
      success: true,
      data: vendorSpecializations,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get
export const getVendorSpecializationById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorSpecialization = await VendorSpecialization.findOne({
      where: { id },
      include: [
        {
          model: VendorDetails,
          as: "vendor",
          attributes: ["id", "company_name", "admin_id"],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name", "admin_id"],
        },
      ],
    });

    if (!vendorSpecialization) {
      return res.status(404).json({
        success: false,
        message: "Vendor specialization not found",
      });
    }

    if (
      vendorSpecialization.vendor.admin_id !== adminId ||
      vendorSpecialization.specialization.admin_id !== adminId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: This record doesn't belong to your admin account",
      });
    }

    res.json({
      success: true,
      data: vendorSpecialization,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get All under a specific vendor
export const getVendorSpecializationsForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendor = await VendorDetails.findOne({
      where: { id, admin_id: adminId },
      include: [
        {
          model: VendorSettings,
          as: "settings",
          attributes: ["works_with_all_specializations"],
        },
      ],
      attributes: ["id", "company_name", "admin_id"],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found or does not belong to your admin account",
      });
    }

    const worksWithAll = vendor.settings?.works_with_all_specializations;

    if (worksWithAll) {
      const adminSpecializations = await AdminSpecialization.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "name", "admin_id"],
        order: [["id", "ASC"]],
      });

      return res.json({
        success: true,
        message: "Vendor works with all admin specializations",
        data: {
          vendor,
          specializations: adminSpecializations,
        },
      });
    }

    const vendorSpecializations = await VendorSpecialization.findAll({
      where: { vendor_id: vendor.id },
      include: [
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name", "admin_id"],
          where: { admin_id: adminId },
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.json({
      success: true,
      message: "Vendor-specific specializations fetched successfully",
      data: {
        vendor,
        specializations: vendorSpecializations.map((v) => v.specialization),
      },
    });
  } catch (error) {
    console.error("Error fetching vendor specializations:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Update
export const updateVendorSpecialization = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_SPECIALIZATION_ALLOWED_FIELDS);

    const vendorSpecialization = await VendorSpecialization.findByPk(id);
    if (!vendorSpecialization) {
      return res.status(404).json({
        success: false,
        message: "Vendor specialization not found",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    const specialization = await AdminSpecialization.findByPk(
      data.specialization_id
    );

    if (!vendor || !specialization) {
      return res.status(404).json({
        success: false,
        message: "Vendor or Specialization not found",
      });
    }

    if (vendor.admin_id !== adminId || specialization.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message:
          "Vendor and Specialization must belong to the same admin account",
      });
    }

    await vendorSpecialization.update(data);

    res.json({
      success: true,
      message: "Vendor specialization updated successfully",
      data: vendorSpecialization,
    });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteVendorSpecialization = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorSpecialization = await VendorSpecialization.findOne({
      where: { id },
      include: [
        { model: VendorDetails, as: "vendor", attributes: ["admin_id"] },
        { model: AdminSpecialization, as: "specialization", attributes: ["admin_id"] },
      ],
    });

    if (!vendorSpecialization) {
      return res.status(404).json({
        success: false,
        message: "Vendor specialization not found",
      });
    }

    if (
      vendorSpecialization.vendor.admin_id !== adminId ||
      vendorSpecialization.specialization.admin_id !== adminId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: This record doesn't belong to your admin account",
      });
    }

    await vendorSpecialization.destroy();

    res.json({
      success: true,
      message: "Vendor specialization deleted successfully",
    });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};