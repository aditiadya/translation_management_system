import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  VendorPriceList,
  VendorDetails,
  VendorService,
  VendorLanguagePair,
  VendorSpecialization,
  AdminCurrency,
  AdminService,
  AdminSpecialization,
  AdminLanguagePair,
  Currency
} = db;

const VENDOR_PRICE_ALLOWED_FIELDS = [
  "vendor_id",
  "service_id",
  "language_pair_id",
  "specialization_id",
  "unit",
  "price_per_unit",
  "currency_id",
  "note",
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

// Add
export const createVendorPrice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_PRICE_ALLOWED_FIELDS);

    if (
      !data.vendor_id ||
      !data.service_id ||
      !data.language_pair_id ||
      !data.specialization_id ||
      !data.unit ||
      !data.price_per_unit ||
      !data.currency_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Vendor does not belong to your admin account",
      });
    }

    const [service, specialization, languagePair, currency] = await Promise.all([
      VendorService.findByPk(data.service_id),
      VendorSpecialization.findByPk(data.specialization_id),
      VendorLanguagePair.findByPk(data.language_pair_id),
      AdminCurrency.findByPk(data.currency_id),
    ]);

    if (!service || !specialization || !languagePair || !currency) {
      return res.status(404).json({
        success: false,
        message: "One or more related records (service, specialization, language pair, currency) not found",
      });
    }

    const existing = await VendorPriceList.findOne({
      where: {
        vendor_id: data.vendor_id,
        service_id: data.service_id,
        language_pair_id: data.language_pair_id,
        specialization_id: data.specialization_id,
        unit: data.unit,
        currency_id: data.currency_id,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This price list entry already exists",
      });
    }

    const newEntry = await VendorPriceList.create(data);
    res.status(201).json({
      success: true,
      message: "Vendor price list entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error creating vendor price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get All
export const getAllVendorPrices = async (req, res) => {
  try {
    const adminId = req.user.id;

    const vendorPrices = await VendorPriceList.findAll({
      include: [
        {
          model: VendorDetails,
          as: "vendor",
          attributes: ["id", "company_name", "admin_id"],
          where: { admin_id: adminId },
        },
        {
          model: VendorService,
          as: "service",
          attributes: ["id", "service_id"],
          include: [
            {
              model: AdminService,
              as: "service",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: VendorLanguagePair,
          as: "languagePair",
          attributes: ["id", "language_pair_id"],
          include: [
            {
              model: AdminLanguagePair,
              as: "languagePair",
              attributes: ["id", "source_language_id", "target_language_id"],
            },
          ],
        },
        {
          model: VendorSpecialization,
          as: "specialization",
          attributes: ["id", "specialization_id"],
          include: [
            {
              model: AdminSpecialization,
              as: "specialization",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: AdminCurrency,
          as: "currency",
          include: [
            {
              model: Currency,
              as: "currency",
              attributes: ["id", "name", "code", "symbol"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: vendorPrices,
    });
  } catch (error) {
    console.error("Error fetching vendor prices:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// Get
export const getVendorPriceById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const entry = await VendorPriceList.findOne({
      where: { id },
      include: [
        {
          model: VendorDetails,
          as: "vendor",
          attributes: ["id", "company_name", "admin_id"],
        },
        {
          model: VendorService,
          as: "service",
          attributes: ["id", "service_id"],
          include: [
            {
              model: AdminService,
              as: "service",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: VendorLanguagePair,
          as: "languagePair",
          attributes: ["id", "language_pair_id"],
          include: [
            {
              model: AdminLanguagePair,
              as: "languagePair",
              attributes: ["id", "source_language_id", "target_language_id"],
            },
          ],
        },
        {
          model: VendorSpecialization,
          as: "specialization",
          attributes: ["id", "specialization_id"],
          include: [
            {
              model: AdminSpecialization,
              as: "specialization",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: AdminCurrency,
          as: "currency",
          include: [
            {
              model: Currency,
              as: "currency",
              attributes: ["id", "name", "code", "symbol"],
            },
          ],
        },
      ],
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Vendor price entry not found",
      });
    }

    if (entry.vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record does not belong to your admin account",
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error fetching vendor price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// Update
export const updateVendorPrice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_PRICE_ALLOWED_FIELDS);

    const existing = await VendorPriceList.findByPk(id, {
      include: [{ model: VendorDetails, as: "vendor", attributes: ["admin_id"] }],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Vendor price entry not found",
      });
    }

    if (existing.vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this vendor price entry",
      });
    }

    await existing.update(data);

    res.json({
      success: true,
      message: "Vendor price entry updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Error updating vendor price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteVendorPrice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const existing = await VendorPriceList.findOne({
      where: { id },
      include: [{ model: VendorDetails, as: "vendor", attributes: ["admin_id"] }],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Vendor price entry not found",
      });
    }

    if (existing.vendor.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record does not belong to your admin account",
      });
    }

    await existing.destroy();

    res.json({
      success: true,
      message: "Vendor price entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vendor price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};