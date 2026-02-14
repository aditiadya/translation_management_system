import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { 
  VendorLanguagePair, 
  VendorDetails, 
  AdminLanguagePair, 
  VendorSettings, 
  Language,
  VendorPriceList, // ADD THIS
} = db;

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

// Bulk delete vendor language pairs - CASCADE DELETE PRICE LIST
export const bulkDeleteVendorLanguagePairs = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { vendor_id, language_pair_ids } = req.body;

    if (!vendor_id || !language_pair_ids || language_pair_ids.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "vendor_id and language_pair_ids are required",
      });
    }

    const vendor = await VendorDetails.findByPk(vendor_id, { transaction });
    if (!vendor || vendor.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Vendor does not belong to your admin account",
      });
    }

    // Delete related price list entries
    const deletedPricesCount = await VendorPriceList.destroy({
      where: {
        vendor_id: vendor_id,
        language_pair_id: language_pair_ids,
      },
      transaction,
    });

    // Delete the mappings
    const deleted = await VendorLanguagePair.destroy({
      where: {
        vendor_id: vendor_id,
        language_pair_id: language_pair_ids,
      },
      transaction,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: `${deleted} language pair(s) and ${deletedPricesCount} related price(s) deleted successfully`,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// Create - WITH PRICE COUNT
export const createVendorLanguagePair = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { vendor_id, language_pair_id, language_pair_ids } = req.body;

    let pairIds = [];
    if (language_pair_ids && Array.isArray(language_pair_ids)) {
      pairIds = language_pair_ids;
    } else if (language_pair_id) {
      pairIds = [language_pair_id];
    }

    const vendor = await VendorDetails.findByPk(vendor_id, { transaction });
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
        message: "Vendor does not belong to your admin account",
      });
    }

    const languagePairs = await AdminLanguagePair.findAll({
      where: {
        id: pairIds,
        admin_id: adminId,
        active_flag: true,
      },
      transaction,
    });

    if (languagePairs.length !== pairIds.length) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Some language pairs not found or don't belong to your admin account",
      });
    }

    const existing = await VendorLanguagePair.findAll({
      where: {
        vendor_id: vendor_id,
        language_pair_id: pairIds,
      },
      transaction,
    });

    const existingIds = existing.map((e) => e.language_pair_id);
    const newPairIds = pairIds.filter((id) => !existingIds.includes(id));

    if (newPairIds.length === 0) {
      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: "All selected language pairs already exist",
        data: existing,
      });
    }

    // Get price counts for new pairs
    const priceCounts = await VendorPriceList.findAll({
      where: {
        vendor_id: vendor_id,
        language_pair_id: newPairIds,
      },
      attributes: [
        "language_pair_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
      ],
      group: ["language_pair_id"],
      raw: true,
      transaction,
    });

    const priceCountMap = {};
    priceCounts.forEach((pc) => {
      priceCountMap[pc.language_pair_id] = parseInt(pc.count) || 0;
    });

    const dataToCreate = newPairIds.map((pairId) => ({
      vendor_id: vendor_id,
      language_pair_id: pairId,
      price_count: priceCountMap[pairId] || 0,
    }));

    const newVendorLanguagePairs = await VendorLanguagePair.bulkCreate(
      dataToCreate,
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: `${newVendorLanguagePairs.length} language pair(s) added successfully`,
      data: newVendorLanguagePairs,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating vendor language pairs:", error);
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

// Get vendor language pairs WITH PRICE COUNTS
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

    const languageInclude = [
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
    ];

    let languagePairs = [];

    if (worksWithAll) {
      // Fetch all admin language pairs
      const adminPairs = await AdminLanguagePair.findAll({
        where: { admin_id: adminId, active_flag: true },
        attributes: ["id", "admin_id", "source_language_id", "target_language_id"],
        include: languageInclude,
        order: [["id", "ASC"]],
      });

      // Get price counts dynamically
      const priceCounts = await VendorPriceList.findAll({
        where: { vendor_id: id },
        attributes: [
          "language_pair_id",
          [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
        ],
        group: ["language_pair_id"],
        raw: true,
      });

      const priceCountMap = {};
      priceCounts.forEach((pc) => {
        priceCountMap[pc.language_pair_id] = parseInt(pc.count) || 0;
      });

      languagePairs = adminPairs.map((pair) => ({
        ...pair.toJSON(),
        price_count: priceCountMap[pair.id] || 0,
      }));
    } else {
      // ✅ FIXED VERSION - Fetch vendor pairs separately
      const vendorPairs = await VendorLanguagePair.findAll({
        where: { vendor_id: id },
        attributes: ["language_pair_id", "price_count"],
        raw: true,
      });

      const priceCountMap = {};
      vendorPairs.forEach((vp) => {
        priceCountMap[vp.language_pair_id] = vp.price_count || 0;
      });

      console.log("Price count map (disabled mode):", priceCountMap);

      // Fetch admin language pairs
      const languagePairIds = Object.keys(priceCountMap).map(Number);
      
      if (languagePairIds.length === 0) {
        return res.json({
          success: true,
          message: "No language pairs selected for this vendor",
          data: {
            vendor: {
              id: vendor.id,
              company_name: vendor.company_name,
              works_with_all_language_pairs: worksWithAll,
            },
            languagePairs: [],
          },
        });
      }

      const adminPairs = await AdminLanguagePair.findAll({
        where: {
          id: languagePairIds,
          admin_id: adminId,
          active_flag: true,
        },
        attributes: ["id", "admin_id", "source_language_id", "target_language_id"],
        include: languageInclude,
        order: [["id", "ASC"]],
      });

      languagePairs = adminPairs.map((pair) => ({
        ...pair.toJSON(),
        price_count: priceCountMap[pair.id] || 0,
      }));

      console.log("Final language pairs:", languagePairs);
    }

    return res.json({
      success: true,
      message: worksWithAll
        ? "Vendor works with all admin language pairs"
        : "Vendor-specific language pairs fetched successfully",
      data: {
        vendor: {
          id: vendor.id,
          company_name: vendor.company_name,
          works_with_all_language_pairs: worksWithAll,
        },
        languagePairs: languagePairs,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor language pairs:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// Get admin language pairs WITH SELECTION AND PRICE COUNTS
export const getAdminLanguagePairsForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendor = await VendorDetails.findOne({
      where: { id, admin_id: adminId },
      attributes: ["id"],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found or does not belong to your admin account",
      });
    }

    const adminPairs = await AdminLanguagePair.findAll({
      where: { admin_id: adminId, active_flag: true },
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

    const vendorPairs = await VendorLanguagePair.findAll({
      where: { vendor_id: id },
      attributes: ["language_pair_id", "price_count"],
    });

    const selectedPairMap = {};
    vendorPairs.forEach((vp) => {
      selectedPairMap[vp.language_pair_id] = vp.price_count || 0;
    });

    const pairsWithSelection = adminPairs.map((pair) => ({
      ...pair.toJSON(),
      is_selected: selectedPairMap.hasOwnProperty(pair.id),
      price_count: selectedPairMap[pair.id] || 0,
    }));

    return res.json({
      success: true,
      data: pairsWithSelection,
    });
  } catch (error) {
    console.error("Error fetching admin language pairs for vendor:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// NEW: Initialize all language pairs when toggle is disabled
export const initializeVendorLanguagePairs = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { vendor_id } = req.body;

    if (!vendor_id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "vendor_id is required",
      });
    }

    const vendor = await VendorDetails.findOne({
      where: { id: vendor_id, admin_id: adminId },
      transaction,
    });

    if (!vendor) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Vendor not found or access denied",
      });
    }

    const adminPairs = await AdminLanguagePair.findAll({
      where: { admin_id: adminId, active_flag: true },
      attributes: ["id"],
      transaction,
    });

    console.log("Admin pairs:", adminPairs.map(p => p.id));

    const priceCounts = await VendorPriceList.findAll({
      where: { vendor_id: vendor_id },
      attributes: [
        "language_pair_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
      ],
      group: ["language_pair_id"],
      raw: true,
      transaction,
    });

    console.log("Price counts:", priceCounts);

    const priceCountMap = {};
    priceCounts.forEach((pc) => {
      priceCountMap[pc.language_pair_id] = parseInt(pc.count) || 0;
    });

    console.log("Price count map:", priceCountMap);

    const vendorPairsToUpsert = adminPairs.map((pair) => ({
      vendor_id: vendor_id,
      language_pair_id: pair.id,
      price_count: priceCountMap[pair.id] || 0,
    }));

    console.log("Pairs to upsert:", vendorPairsToUpsert);

    await VendorLanguagePair.bulkCreate(vendorPairsToUpsert, {
      updateOnDuplicate: ["price_count", "updatedAt"],
      transaction,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: "All language pairs initialized for vendor",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error initializing vendor language pairs:", error);
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

// DELETE - CASCADE DELETE PRICE LIST
export const deleteVendorLanguagePair = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorLanguagePair = await VendorLanguagePair.findOne({
      where: { id },
      include: [
        { model: VendorDetails, as: "vendor", attributes: ["admin_id"] },
        { model: AdminLanguagePair, as: "languagePair", attributes: ["admin_id", "id"] },
      ],
      transaction,
    });

    if (!vendorLanguagePair) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor language pair not found",
      });
    }

    if (
      vendorLanguagePair.vendor.admin_id !== adminId ||
      vendorLanguagePair.languagePair.admin_id !== adminId
    ) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Access denied: This record doesn't belong to your admin account",
      });
    }

    // Delete related price list entries
    const deletedPricesCount = await VendorPriceList.destroy({
      where: {
        vendor_id: vendorLanguagePair.vendor_id,
        language_pair_id: vendorLanguagePair.language_pair_id,
      },
      transaction,
    });

    console.log(
      `Deleted ${deletedPricesCount} price(s) for vendor_id=${vendorLanguagePair.vendor_id}, language_pair_id=${vendorLanguagePair.language_pair_id}`
    );

    await vendorLanguagePair.destroy({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: `Vendor language pair and ${deletedPricesCount} related price(s) deleted successfully`,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

