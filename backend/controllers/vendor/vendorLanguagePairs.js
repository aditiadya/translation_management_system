import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { VendorLanguagePair, VendorDetails, AdminLanguagePair, VendorSettings } = db;

const VENDOR_LANGUAGE_PAIR_ALLOWED_FIELDS = ["vendor_id", "language_pair_id"];

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

// Create
export const createVendorLanguagePair = async (req, res) => {
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_LANGUAGE_PAIR_ALLOWED_FIELDS);

    if (!data.vendor_id || !data.language_pair_id) {
      return res.status(400).json({
        success: false,
        message: "vendor_id and language_pair_id are required",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    const languagePair = await AdminLanguagePair.findByPk(data.language_pair_id);

    if (!vendor || !languagePair) {
      return res.status(404).json({
        success: false,
        message: "Vendor or Language Pair not found",
      });
    }

    if (vendor.admin_id !== adminId || languagePair.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Vendor and Language Pair must belong to the same admin",
      });
    }

    const existing = await VendorLanguagePair.findOne({
      where: { vendor_id: data.vendor_id, language_pair_id: data.language_pair_id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This vendor-language pair mapping already exists",
      });
    }

    const newVendorLanguagePair = await VendorLanguagePair.create(data);
    res.status(201).json({
      success: true,
      message: "Vendor language pair created successfully",
      data: newVendorLanguagePair,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get all
export const getAllVendorLanguagePairs = async (req, res) => {
  try {
    const adminId = req.user.id;

    const vendorLanguagePairs = await VendorLanguagePair.findAll({
      include: [
        {
          model: VendorDetails,
          as: "vendor",
          attributes: ["id", "company_name", "admin_id"],
          where: { admin_id: adminId },
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "admin_id", "source_language_id", "target_language_id"],
          where: { admin_id: adminId },
        },
      ],
    });

    res.json({
      success: true,
      data: vendorLanguagePairs,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get by ID
export const getVendorLanguagePairById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorLanguagePair = await VendorLanguagePair.findOne({
      where: { id },
      include: [
        {
          model: VendorDetails,
          as: "vendor",
          attributes: ["id", "company_name", "admin_id"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "admin_id", "source_language_id", "target_language_id"],
        },
      ],
    });

    if (!vendorLanguagePair) {
      return res.status(404).json({
        success: false,
        message: "Vendor language pair not found",
      });
    }

    if (
      vendorLanguagePair.vendor.admin_id !== adminId ||
      vendorLanguagePair.languagePair.admin_id !== adminId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record doesn't belong to your admin account",
      });
    }

    res.json({
      success: true,
      data: vendorLanguagePair,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

export const getVendorLanguagePairsForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendor = await VendorDetails.findOne({
      where: { id, admin_id: adminId },
      include: [
        {
          model: VendorSettings,
          as: "settings",
          attributes: ["works_with_all_language_pairs"],
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

    const worksWithAll = vendor.settings?.works_with_all_language_pairs;

    if (worksWithAll) {
      const adminLanguagePairs = await AdminLanguagePair.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "source_language_id", "target_language_id", "admin_id"],
        order: [["id", "ASC"]],
      });

      return res.json({
        success: true,
        message: "Vendor works with all admin language pairs",
        data: {
          vendor,
          languagePairs: adminLanguagePairs,
        },
      });
    }

    const vendorLanguagePairs = await VendorLanguagePair.findAll({
      where: { vendor_id: vendor.id },
      include: [
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id", "admin_id"],
          where: { admin_id: adminId },
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.json({
      success: true,
      message: "Vendor-specific language pairs fetched successfully",
      data: {
        vendor,
        languagePairs: vendorLanguagePairs.map((v) => v.languagePair),
      },
    });
  } catch (error) {
    console.error("Error fetching vendor language pairs:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// Update
export const updateVendorLanguagePair = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_LANGUAGE_PAIR_ALLOWED_FIELDS);

    const vendorLanguagePair = await VendorLanguagePair.findByPk(id);
    if (!vendorLanguagePair) {
      return res.status(404).json({
        success: false,
        message: "Vendor language pair not found",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    const languagePair = await AdminLanguagePair.findByPk(data.language_pair_id);

    if (!vendor || !languagePair) {
      return res.status(404).json({
        success: false,
        message: "Vendor or Language Pair not found",
      });
    }

    if (vendor.admin_id !== adminId || languagePair.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Vendor and Language Pair must belong to the same admin",
      });
    }

    await vendorLanguagePair.update(data);

    res.json({
      success: true,
      message: "Vendor language pair updated successfully",
      data: vendorLanguagePair,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteVendorLanguagePair = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorLanguagePair = await VendorLanguagePair.findOne({
      where: { id },
      include: [
        { model: VendorDetails, as: "vendor", attributes: ["admin_id"] },
        { model: AdminLanguagePair, as: "languagePair", attributes: ["admin_id"] },
      ],
    });

    if (!vendorLanguagePair) {
      return res.status(404).json({
        success: false,
        message: "Vendor language pair not found",
      });
    }

    if (
      vendorLanguagePair.vendor.admin_id !== adminId ||
      vendorLanguagePair.languagePair.admin_id !== adminId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record doesn't belong to your admin account",
      });
    }

    await vendorLanguagePair.destroy();

    res.json({
      success: true,
      message: "Vendor language pair deleted successfully",
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};