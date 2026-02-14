import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  VendorPriceList,
  VendorDetails,
  VendorService,
  VendorSettings,
  VendorLanguagePair,
  VendorSpecialization,
  AdminCurrency,
  AdminService,
  AdminSpecialization,
  AdminLanguagePair,
  Currency,
  Language,
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

// CREATE - WITH PRICE COUNT INCREMENT FOR ALL THREE
export const createVendorPrice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_PRICE_ALLOWED_FIELDS);

    console.log("--- Starting createVendorPrice with Settings Check ---");

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
        await transaction.rollback();
        return res.status(400).json({ success: false, message: `Missing field: ${field}` });
      }
    }

    // 1. Fetch Vendor and their Settings
    const vendor = await VendorDetails.findOne({
      where: { id: data.vendor_id, admin_id: adminId },
      include: [{ model: VendorSettings, as: "settings" }],
      transaction,
    });

    if (!vendor) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: "Vendor access denied or not found" });
    }

    const settings = vendor.settings || {};

    // 2️⃣ Service Validation
    const adminService = await AdminService.findOne({
      where: { id: data.service_id, admin_id: adminId },
      transaction,
    });

    if (!adminService) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (!settings.works_with_all_services) {
      const hasAccess = await VendorService.findOne({
        where: {
          vendor_id: vendor.id,
          service_id: data.service_id,
        },
        transaction,
      });
      if (!hasAccess) {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Service not assigned to vendor" });
      }
    }

    // 3️⃣ Language Pair Validation
    const adminLP = await AdminLanguagePair.findOne({
      where: { id: data.language_pair_id, admin_id: adminId },
      transaction,
    });

    if (!adminLP) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Language pair not found" });
    }

    if (!settings.works_with_all_language_pairs) {
      const hasAccess = await VendorLanguagePair.findOne({
        where: {
          vendor_id: vendor.id,
          language_pair_id: data.language_pair_id,
        },
        transaction,
      });
      if (!hasAccess) {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Language pair not assigned to vendor" });
      }
    }

    // 4️⃣ Specialization Validation
    const adminSpec = await AdminSpecialization.findOne({
      where: { id: data.specialization_id, admin_id: adminId },
      transaction,
    });

    if (!adminSpec) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Specialization not found" });
    }

    if (!settings.works_with_all_specializations) {
      const hasAccess = await VendorSpecialization.findOne({
        where: {
          vendor_id: vendor.id,
          specialization_id: data.specialization_id,
        },
        transaction,
      });
      if (!hasAccess) {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Specialization not assigned to vendor" });
      }
    }

    // 5️⃣ Currency Validation
    const currency = await AdminCurrency.findByPk(data.currency_id, { transaction });
    if (!currency) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Invalid currency_id" });
    }

    // 6️⃣ Check for Duplicates
    const existing = await VendorPriceList.findOne({
      where: {
        vendor_id: data.vendor_id,
        service_id: data.service_id,
        language_pair_id: data.language_pair_id,
        specialization_id: data.specialization_id,
        unit: data.unit,
        currency_id: data.currency_id,
      },
      transaction,
    });

    if (existing) {
      await transaction.rollback();
      return res.status(409).json({ success: false, message: "Price entry already exists" });
    }

    // 7️⃣ Create Entry
    const newEntry = await VendorPriceList.create(data, { transaction });

    // 8️⃣ INCREMENT PRICE COUNTS
    if (!settings.works_with_all_services) {
      await db.sequelize.query(
        `UPDATE vendor_services 
         SET price_count = COALESCE(price_count, 0) + 1, 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND service_id = :service_id`,
        {
          replacements: {
            vendor_id: data.vendor_id,
            service_id: data.service_id,
          },
          transaction,
        }
      );
      console.log(`Incremented price_count for service_id=${data.service_id}`);
    }

    if (!settings.works_with_all_language_pairs) {
      await db.sequelize.query(
        `UPDATE vendor_language_pairs 
         SET price_count = COALESCE(price_count, 0) + 1, 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND language_pair_id = :language_pair_id`,
        {
          replacements: {
            vendor_id: data.vendor_id,
            language_pair_id: data.language_pair_id,
          },
          transaction,
        }
      );
      console.log(`Incremented price_count for language_pair_id=${data.language_pair_id}`);
    }

    if (!settings.works_with_all_specializations) {
      await db.sequelize.query(
        `UPDATE vendor_specializations 
         SET price_count = COALESCE(price_count, 0) + 1, 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND specialization_id = :specialization_id`,
        {
          replacements: {
            vendor_id: data.vendor_id,
            specialization_id: data.specialization_id,
          },
          transaction,
        }
      );
      console.log(`Incremented price_count for specialization_id=${data.specialization_id}`);
    }

    await transaction.commit();

    return res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// GET ALL - No changes needed
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
          model: AdminService,
          as: "service",
          attributes: ["id", "name"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id"],
          include: [
            {
              model: Language,
              as: "sourceLanguage",
              attributes: ["id", "name", "code"],
            },
            {
              model: Language,
              as: "targetLanguage",
              attributes: ["id", "name", "code"],
            },
          ],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name"],
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

// GET BY ID - No changes needed
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
          model: AdminService,
          as: "service",
          attributes: ["id", "name"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id"],
          include: [
            {
              model: Language,
              as: "sourceLanguage",
              attributes: ["id", "name", "code"],
            },
            {
              model: Language,
              as: "targetLanguage",
              attributes: ["id", "name", "code"],
            },
          ],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name"],
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

// GET FOR VENDOR - No changes needed
export const getVendorPriceListForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id: vendorId } = req.params;

    const vendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
      include: [
        {
          model: VendorSettings,
          as: "settings",
          attributes: [
            "works_with_all_services",
            "works_with_all_language_pairs",
            "works_with_all_specializations",
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

    let languagePairs;
    if (settings.works_with_all_language_pairs) {
      languagePairs = await AdminLanguagePair.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "source_language_id", "target_language_id"],
        include: [
          {
            model: Language,
            as: "sourceLanguage",
            attributes: ["id", "name", "code"],
          },
          {
            model: Language,
            as: "targetLanguage",
            attributes: ["id", "name", "code"],
          },
        ],
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
            include: [
              {
                model: Language,
                as: "sourceLanguage",
                attributes: ["id", "name", "code"],
              },
              {
                model: Language,
                as: "targetLanguage",
                attributes: ["id", "name", "code"],
              },
            ],
          },
        ],
        order: [["id", "ASC"]],
      });
      languagePairs = vendorLP.map((p) => p.languagePair);
    }

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

    const vendorPrices = await VendorPriceList.findAll({
      where: { vendor_id: vendorId },
      include: [
        {
          model: AdminService,
          as: "service",
          attributes: ["id", "name"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id"],
          include: [
            {
              model: Language,
              as: "sourceLanguage",
              attributes: ["id", "name", "code"],
            },
            {
              model: Language,
              as: "targetLanguage",
              attributes: ["id", "name", "code"],
            },
          ],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name"],
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

// UPDATE - WITH PRICE COUNT MANAGEMENT FOR ALL THREE
export const updateVendorPrice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_PRICE_ALLOWED_FIELDS);

    const existing = await VendorPriceList.findByPk(id, {
      include: [{ model: VendorDetails, as: "vendor", attributes: ["admin_id"] }],
      transaction,
    });

    if (!existing) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor price entry not found",
      });
    }

    if (existing.vendor.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "You do not have access to this vendor price entry",
      });
    }

    // Get vendor settings
    const settings = await VendorSettings.findOne({
      where: { vendor_id: existing.vendor_id },
      transaction,
    });

    // If service_id is being changed
    if (data.service_id && data.service_id !== existing.service_id && !settings?.works_with_all_services) {
      await db.sequelize.query(
        `UPDATE vendor_services 
         SET price_count = GREATEST(COALESCE(price_count, 1) - 1, 0), 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND service_id = :service_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            service_id: existing.service_id,
          },
          transaction,
        }
      );

      await db.sequelize.query(
        `UPDATE vendor_services 
         SET price_count = COALESCE(price_count, 0) + 1, 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND service_id = :service_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            service_id: data.service_id,
          },
          transaction,
        }
      );
      console.log(`Updated price_count: service ${existing.service_id} → ${data.service_id}`);
    }

    // If language_pair_id is being changed
    if (
      data.language_pair_id &&
      data.language_pair_id !== existing.language_pair_id &&
      !settings?.works_with_all_language_pairs
    ) {
      await db.sequelize.query(
        `UPDATE vendor_language_pairs 
         SET price_count = GREATEST(COALESCE(price_count, 1) - 1, 0), 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND language_pair_id = :language_pair_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            language_pair_id: existing.language_pair_id,
          },
          transaction,
        }
      );

      await db.sequelize.query(
        `UPDATE vendor_language_pairs 
         SET price_count = COALESCE(price_count, 0) + 1, 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND language_pair_id = :language_pair_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            language_pair_id: data.language_pair_id,
          },
          transaction,
        }
      );
      console.log(`Updated price_count: language_pair ${existing.language_pair_id} → ${data.language_pair_id}`);
    }

    // If specialization_id is being changed
    if (
      data.specialization_id &&
      data.specialization_id !== existing.specialization_id &&
      !settings?.works_with_all_specializations
    ) {
      await db.sequelize.query(
        `UPDATE vendor_specializations 
         SET price_count = GREATEST(COALESCE(price_count, 1) - 1, 0), 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND specialization_id = :specialization_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            specialization_id: existing.specialization_id,
          },
          transaction,
        }
      );

      await db.sequelize.query(
        `UPDATE vendor_specializations 
         SET price_count = COALESCE(price_count, 0) + 1, 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND specialization_id = :specialization_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            specialization_id: data.specialization_id,
          },
          transaction,
        }
      );
      console.log(`Updated price_count: specialization ${existing.specialization_id} → ${data.specialization_id}`);
    }

    await existing.update(data, { transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: "Vendor price entry updated successfully",
      data: existing,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating vendor price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// DELETE - WITH PRICE COUNT DECREMENT FOR ALL THREE
export const deleteVendorPrice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const existing = await VendorPriceList.findOne({
      where: { id },
      include: [{ model: VendorDetails, as: "vendor", attributes: ["admin_id"] }],
      transaction,
    });

    if (!existing) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor price entry not found",
      });
    }

    if (existing.vendor.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Access denied: This record does not belong to your admin account",
      });
    }

    // Get vendor settings
    const settings = await VendorSettings.findOne({
      where: { vendor_id: existing.vendor_id },
      transaction,
    });

    // DECREMENT PRICE COUNTS BEFORE DELETION
    if (!settings?.works_with_all_services && existing.service_id) {
      await db.sequelize.query(
        `UPDATE vendor_services 
         SET price_count = GREATEST(COALESCE(price_count, 1) - 1, 0), 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND service_id = :service_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            service_id: existing.service_id,
          },
          transaction,
        }
      );
      console.log(`Decremented price_count for service_id=${existing.service_id}`);
    }

    if (!settings?.works_with_all_language_pairs && existing.language_pair_id) {
      await db.sequelize.query(
        `UPDATE vendor_language_pairs 
         SET price_count = GREATEST(COALESCE(price_count, 1) - 1, 0), 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND language_pair_id = :language_pair_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            language_pair_id: existing.language_pair_id,
          },
          transaction,
        }
      );
      console.log(`Decremented price_count for language_pair_id=${existing.language_pair_id}`);
    }

    if (!settings?.works_with_all_specializations && existing.specialization_id) {
      await db.sequelize.query(
        `UPDATE vendor_specializations 
         SET price_count = GREATEST(COALESCE(price_count, 1) - 1, 0), 
             updatedAt = NOW() 
         WHERE vendor_id = :vendor_id AND specialization_id = :specialization_id`,
        {
          replacements: {
            vendor_id: existing.vendor_id,
            specialization_id: existing.specialization_id,
          },
          transaction,
        }
      );
      console.log(`Decremented price_count for specialization_id=${existing.specialization_id}`);
    }

    await existing.destroy({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: "Vendor price entry deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting vendor price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

