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

    const requiredFields = [
      "vendor_id",
      "service_id",
      "language_pair_id",
      "specialization_id",
      "unit",
      "price_per_unit",
      "currency_id",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    // Validate vendor + admin ownership
    const vendor = await VendorDetails.findByPk(data.vendor_id);
    if (!vendor)
      return res.status(404).json({ success: false, message: "Vendor not found" });

    if (vendor.admin_id !== adminId)
      return res.status(403).json({
        success: false,
        message: "Vendor does not belong to your admin account",
      });

    // --------------------------------------------------------
    // 1️⃣ Normalize Service ID (accept vendor_service.id or admin_service.id)
    // --------------------------------------------------------
    let vendorService = await VendorService.findByPk(data.service_id);

    if (!vendorService) {
      // maybe admin-level ID
      const adminService = await AdminService.findByPk(data.service_id);

      if (!adminService) {
        return res.status(404).json({
          success: false,
          message: "Invalid service_id: no vendor or admin record found",
        });
      }

      vendorService = await VendorService.findOne({
        where: {
          vendor_id: vendor.id,
          service_id: adminService.id,
        },
      });

      if (!vendorService) {
        return res.status(404).json({
          success: false,
          message: "Vendor does not have this service",
        });
      }
    }

    data.service_id = vendorService.id;

    // --------------------------------------------------------
    // 2️⃣ Normalize Language Pair ID
    // --------------------------------------------------------
    let vendorLP = await VendorLanguagePair.findByPk(data.language_pair_id);

    if (!vendorLP) {
      const adminLP = await AdminLanguagePair.findByPk(data.language_pair_id);
      if (!adminLP) {
        return res.status(404).json({
          success: false,
          message: "Invalid language_pair_id: not found",
        });
      }

      vendorLP = await VendorLanguagePair.findOne({
        where: {
          vendor_id: vendor.id,
          language_pair_id: adminLP.id,
        },
      });

      if (!vendorLP) {
        return res.status(404).json({
          success: false,
          message: "Vendor does not have this language pair",
        });
      }
    }

    data.language_pair_id = vendorLP.id;

    // --------------------------------------------------------
    // 3️⃣ Normalize Specialization ID
    // --------------------------------------------------------
    let vendorSpec = await VendorSpecialization.findByPk(data.specialization_id);

    if (!vendorSpec) {
      const adminSpec = await AdminSpecialization.findByPk(data.specialization_id);
      if (!adminSpec) {
        return res.status(404).json({
          success: false,
          message: "Invalid specialization_id: not found",
        });
      }

      vendorSpec = await VendorSpecialization.findOne({
        where: {
          vendor_id: vendor.id,
          specialization_id: adminSpec.id,
        },
      });

      if (!vendorSpec) {
        return res.status(404).json({
          success: false,
          message: "Vendor does not have this specialization",
        });
      }
    }

    data.specialization_id = vendorSpec.id;

    // --------------------------------------------------------
    // 4️⃣ Validate currency
    // --------------------------------------------------------
    const currency = await AdminCurrency.findByPk(data.currency_id);
    if (!currency) {
      return res.status(404).json({
        success: false,
        message: "Invalid currency_id",
      });
    }

    // --------------------------------------------------------
    // 5️⃣ Prevent duplicate entries
    // --------------------------------------------------------
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

    // --------------------------------------------------------
    // 6️⃣ Create
    // --------------------------------------------------------
    const newEntry = await VendorPriceList.create(data);

    return res.status(201).json({
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

export const getVendorPriceListForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id: vendorId } = req.params;

    // 1. Validate vendor belongs to admin + fetch vendor settings
    const vendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
      include: [
        {
          model: VendorSettings,
          as: "settings",
          attributes: [
            "works_with_all_services",
            "works_with_all_language_pairs",
            "works_with_all_specializations"
          ],
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

    const settings = vendor.settings || {};

    // ---------------------------------------------------------
    // 2. Fetch Service List based on vendor settings
    // ---------------------------------------------------------
    let services;

    if (settings.works_with_all_services) {
      services = await AdminService.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });
    } else {
      const vendorServices = await VendorService.findAll({
        where: { vendor_id: vendorId },
        include: [
          {
            model: AdminService,
            as: "service",
            attributes: ["id", "name"],
            where: { admin_id: adminId },
          },
        ],
        order: [["id", "ASC"]],
      });

      services = vendorServices.map((s) => s.service);
    }

    // ---------------------------------------------------------
    // 3. Fetch Language Pair List based on settings
    // ---------------------------------------------------------
    let languagePairs;

    if (settings.works_with_all_language_pairs) {
      languagePairs = await AdminLanguagePair.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "source_language_id", "target_language_id"],
        order: [["id", "ASC"]],
      });
    } else {
      const vendorLP = await VendorLanguagePair.findAll({
        where: { vendor_id: vendorId },
        include: [
          {
            model: AdminLanguagePair,
            as: "languagePair",
            attributes: ["id", "source_language_id", "target_language_id"],
            where: { admin_id: adminId },
          },
        ],
        order: [["id", "ASC"]],
      });

      languagePairs = vendorLP.map((p) => p.languagePair);
    }

    // ---------------------------------------------------------
    // 4. Fetch Specialization List based on settings
    // ---------------------------------------------------------
    let specializations;

    if (settings.works_with_all_specializations) {
      specializations = await AdminSpecialization.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });
    } else {
      const vendorSpecs = await VendorSpecialization.findAll({
        where: { vendor_id: vendorId },
        include: [
          {
            model: AdminSpecialization,
            as: "specialization",
            attributes: ["id", "name"],
            where: { admin_id: adminId },
          },
        ],
        order: [["id", "ASC"]],
      });

      specializations = vendorSpecs.map((s) => s.specialization);
    }

    // ---------------------------------------------------------
    // 5. Fetch Price List Entries for this vendor
    // ---------------------------------------------------------
    const vendorPrices = await VendorPriceList.findAll({
      where: { vendor_id: vendorId },
      include: [
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

    // ---------------------------------------------------------
    // 6. Final Response
    // ---------------------------------------------------------
    return res.json({
      success: true,
      data: {
        vendor,
        settings,
        dropdowns: {
          services,
          languagePairs,
          specializations,
        },
        priceList: vendorPrices,
      },
    });

  } catch (error) {
    console.error("Error fetching vendor price list:", error);
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