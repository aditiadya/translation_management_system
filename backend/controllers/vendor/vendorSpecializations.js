import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { 
  VendorSpecialization, 
  VendorDetails, 
  AdminSpecialization, 
  VendorSettings,
  VendorPriceList, // ADD THIS
} = db;

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

// CREATE - WITH PRICE COUNT
export const createVendorSpecialization = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_SPECIALIZATION_ALLOWED_FIELDS);

    if (!data.vendor_id || !data.specialization_id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "vendor_id and specialization_id are required",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id, { transaction });
    const specialization = await AdminSpecialization.findByPk(
      data.specialization_id,
      { transaction }
    );

    if (!vendor || !specialization) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor or Specialization not found",
      });
    }

    if (vendor.admin_id !== adminId || specialization.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Vendor and Specialization must belong to the same admin account",
      });
    }

    const existing = await VendorSpecialization.findOne({
      where: {
        vendor_id: data.vendor_id,
        specialization_id: data.specialization_id,
      },
      transaction,
    });

    if (existing) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "This vendor-specialization mapping already exists",
      });
    }

    // Get current price count for this specialization
    const priceCount = await VendorPriceList.count({
      where: {
        vendor_id: data.vendor_id,
        specialization_id: data.specialization_id,
      },
      transaction,
    });

    const newVendorSpecialization = await VendorSpecialization.create(
      {
        ...data,
        price_count: priceCount,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Vendor specialization created successfully",
      data: newVendorSpecialization,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating vendor specialization:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// GET ALL - No changes needed
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

// GET BY ID - No changes needed
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
        message: "Access denied: This record doesn't belong to your admin account",
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

// GET FOR VENDOR - WITH PRICE COUNTS
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

    let specializations = [];

    if (worksWithAll) {
      const adminSpecializations = await AdminSpecialization.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "name", "admin_id"],
        order: [["id", "ASC"]],
      });

      const priceCounts = await VendorPriceList.findAll({
        where: { vendor_id: id },
        attributes: [
          "specialization_id",
          [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
        ],
        group: ["specialization_id"],
        raw: true,
      });

      const priceCountMap = {};
      priceCounts.forEach((pc) => {
        priceCountMap[pc.specialization_id] = parseInt(pc.count) || 0;
      });

      specializations = adminSpecializations.map((spec) => ({
        ...spec.toJSON(),
        price_count: priceCountMap[spec.id] || 0,
      }));
    } else {
      // Get vendor specializations WITH mapping IDs
      const vendorSpecs = await VendorSpecialization.findAll({
        where: { vendor_id: id },
        attributes: ["id", "specialization_id", "price_count"], // Include the mapping ID
        raw: true,
      });

      const priceCountMap = {};
      const mappingIdMap = {}; // NEW: Store mapping IDs
      
      vendorSpecs.forEach((vs) => {
        priceCountMap[vs.specialization_id] = vs.price_count || 0;
        mappingIdMap[vs.specialization_id] = vs.id; // Store the vendor_specializations.id
      });

      const specializationIds = Object.keys(priceCountMap).map(Number);

      if (specializationIds.length === 0) {
        return res.json({
          success: true,
          message: "No specializations selected for this vendor",
          data: {
            vendor: {
              id: vendor.id,
              company_name: vendor.company_name,
              works_with_all_specializations: worksWithAll,
            },
            specializations: [],
          },
        });
      }

      const adminSpecializations = await AdminSpecialization.findAll({
        where: {
          id: specializationIds,
          admin_id: adminId,
        },
        attributes: ["id", "name", "admin_id"],
        order: [["id", "ASC"]],
      });

      specializations = adminSpecializations.map((spec) => ({
        ...spec.toJSON(),
        price_count: priceCountMap[spec.id] || 0,
        mapping_id: mappingIdMap[spec.id], // NEW: Include mapping ID for deletion
      }));
    }

    return res.json({
      success: true,
      message: worksWithAll
        ? "Vendor works with all admin specializations"
        : "Vendor-specific specializations fetched successfully",
      data: {
        vendor: {
          id: vendor.id,
          company_name: vendor.company_name,
          works_with_all_specializations: worksWithAll,
        },
        specializations: specializations,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor specializations:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// UPDATE - No changes needed
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
    const specialization = await AdminSpecialization.findByPk(data.specialization_id);

    if (!vendor || !specialization) {
      return res.status(404).json({
        success: false,
        message: "Vendor or Specialization not found",
      });
    }

    if (vendor.admin_id !== adminId || specialization.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Vendor and Specialization must belong to the same admin account",
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

// DELETE - WITH CASCADE DELETE OF PRICES
export const deleteVendorSpecialization = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorSpecialization = await VendorSpecialization.findOne({
      where: { id },
      include: [
        { model: VendorDetails, as: "vendor", attributes: ["admin_id"] },
        { model: AdminSpecialization, as: "specialization", attributes: ["admin_id"] },
      ],
      transaction,
    });

    if (!vendorSpecialization) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor specialization not found",
      });
    }

    if (
      vendorSpecialization.vendor.admin_id !== adminId ||
      vendorSpecialization.specialization.admin_id !== adminId
    ) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Access denied: This record doesn't belong to your admin account",
      });
    }

    // CASCADE DELETE: Delete all related prices first
    const deletedPricesCount = await VendorPriceList.destroy({
      where: {
        vendor_id: vendorSpecialization.vendor_id,
        specialization_id: vendorSpecialization.specialization_id,
      },
      transaction,
    });

    console.log(
      `Deleted ${deletedPricesCount} price(s) for vendor_id=${vendorSpecialization.vendor_id}, specialization_id=${vendorSpecialization.specialization_id}`
    );

    // Then delete the specialization mapping
    await vendorSpecialization.destroy({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: `Vendor specialization and ${deletedPricesCount} related price(s) deleted successfully`,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting vendor specialization:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// NEW: Initialize all specializations when toggle is disabled
export const initializeVendorSpecializations = async (req, res) => {
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

    const adminSpecs = await AdminSpecialization.findAll({
      where: { admin_id: adminId },
      attributes: ["id"],
      transaction,
    });

    const priceCounts = await VendorPriceList.findAll({
      where: { vendor_id: vendor_id },
      attributes: [
        "specialization_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
      ],
      group: ["specialization_id"],
      raw: true,
      transaction,
    });

    const priceCountMap = {};
    priceCounts.forEach((pc) => {
      priceCountMap[pc.specialization_id] = parseInt(pc.count) || 0;
    });

    const vendorSpecsToUpsert = adminSpecs.map((spec) => ({
      vendor_id: vendor_id,
      specialization_id: spec.id,
      price_count: priceCountMap[spec.id] || 0,
    }));

    await VendorSpecialization.bulkCreate(vendorSpecsToUpsert, {
      updateOnDuplicate: ["price_count", "updatedAt"],
      transaction,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: "All specializations initialized for vendor",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error initializing vendor specializations:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};
