import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { 
  VendorService, 
  VendorDetails, 
  AdminService, 
  VendorSettings,
  VendorPriceList, // ADD THIS
} = db;

const VENDOR_SERVICE_ALLOWED_FIELDS = ["vendor_id", "service_id"];

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
export const createVendorService = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_SERVICE_ALLOWED_FIELDS);

    if (!data.vendor_id || !data.service_id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "vendor_id and service_id are required",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id, { transaction });
    const service = await AdminService.findByPk(data.service_id, { transaction });

    if (!vendor || !service) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor or Service not found",
      });
    }

    if (vendor.admin_id !== adminId || service.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Vendor and Service must belong to the same admin",
      });
    }

    const existing = await VendorService.findOne({
      where: { vendor_id: data.vendor_id, service_id: data.service_id },
      transaction,
    });

    if (existing) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "This vendor-service mapping already exists",
      });
    }

    // Get current price count for this vendor-service combination
    const priceCount = await VendorPriceList.count({
      where: {
        vendor_id: data.vendor_id,
        service_id: data.service_id,
      },
      transaction,
    });

    const newVendorService = await VendorService.create(
      {
        ...data,
        price_count: priceCount,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Vendor service created successfully",
      data: newVendorService,
    });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get all
export const getAllVendorServices = async (req, res) => {
  try {
    const adminId = req.user.id;

    const vendorServices = await VendorService.findAll({
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
          attributes: ["id", "name", "admin_id"],
          where: { admin_id: adminId },
        },
      ],
    });

    res.json({
      success: true,
      data: vendorServices,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get
export const getVendorServiceById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorService = await VendorService.findOne({
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
          attributes: ["id", "name", "admin_id"],
        },
      ],
    });

    if (!vendorService) {
      return res.status(404).json({
        success: false,
        message: "Vendor service not found",
      });
    }

    if (
      vendorService.vendor.admin_id !== adminId ||
      vendorService.service.admin_id !== adminId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record doesn't belong to your admin account",
      });
    }

    res.json({
      success: true,
      data: vendorService,
    });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get all services for vendor WITH PRICE COUNTS
export const getVendorServicesForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendor = await VendorDetails.findOne({
      where: { id: id, admin_id: adminId },
      include: [
        {
          model: VendorSettings,
          as: "settings",
          attributes: ["works_with_all_services"],
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

    const worksWithAll = vendor.settings?.works_with_all_services;

    if (worksWithAll) {
      // When works_with_all is true, fetch admin services with price counts
      const adminServices = await AdminService.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      });

      // Get price counts for this vendor
      const priceCounts = await VendorPriceList.findAll({
        where: { vendor_id: vendor.id },
        attributes: [
          "service_id",
          [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
        ],
        group: ["service_id"],
        raw: true,
      });

      const priceCountMap = {};
      priceCounts.forEach((pc) => {
        priceCountMap[pc.service_id] = parseInt(pc.count) || 0;
      });

      const servicesWithCounts = adminServices.map((service) => ({
        ...service.toJSON(),
        price_count: priceCountMap[service.id] || 0,
      }));

      return res.json({
        success: true,
        message: "Vendor works with all admin services",
        data: {
          vendor,
          services: servicesWithCounts,
        },
      });
    }

    // When works_with_all is false, use cached price_count from vendor_services
    const vendorServices = await VendorService.findAll({
      where: { vendor_id: vendor.id },
      attributes: ["id", "service_id", "price_count"],
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

    const servicesWithCounts = vendorServices.map((vs) => ({
      ...vs.service.toJSON(),
      price_count: vs.price_count || 0,
    }));

    return res.json({
      success: true,
      message: "Vendor-specific services fetched successfully",
      data: {
        vendor,
        services: servicesWithCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching vendor services:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Update
export const updateVendorService = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, VENDOR_SERVICE_ALLOWED_FIELDS);

    const vendorService = await VendorService.findByPk(id);
    if (!vendorService) {
      return res.status(404).json({
        success: false,
        message: "Vendor service not found",
      });
    }

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    const service = await AdminService.findByPk(data.service_id);

    if (!vendor || !service) {
      return res.status(404).json({
        success: false,
        message: "Vendor or Service not found",
      });
    }

    if (vendor.admin_id !== adminId || service.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Vendor and Service must belong to the same admin",
      });
    }

    await vendorService.update(data);

    res.json({
      success: true,
      message: "Vendor service updated successfully",
      data: vendorService,
    });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// DELETE - CASCADE DELETE PRICE LIST
export const deleteVendorService = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorService = await VendorService.findOne({
      where: { id },
      include: [
        { model: VendorDetails, as: "vendor", attributes: ["admin_id"] },
        { model: AdminService, as: "service", attributes: ["admin_id", "id"] },
      ],
      transaction,
    });

    if (!vendorService) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Vendor service not found",
      });
    }

    if (
      vendorService.vendor.admin_id !== adminId ||
      vendorService.service.admin_id !== adminId
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
        vendor_id: vendorService.vendor_id,
        service_id: vendorService.service_id,
      },
      transaction,
    });

    console.log(
      `Deleted ${deletedPricesCount} price(s) for vendor_id=${vendorService.vendor_id}, service_id=${vendorService.service_id}`
    );

    await vendorService.destroy({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: `Vendor service and ${deletedPricesCount} related price(s) deleted successfully`,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};


// Get admin services for vendor WITH SELECTION AND PRICE COUNTS
export const getAdminServicesForVendor = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id: vendorId } = req.params;

    const vendor = await VendorDetails.findOne({
      where: { id: vendorId, admin_id: adminId },
      attributes: ["id"],
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found or does not belong to your admin account",
      });
    }

    // Get all admin services
    const adminServices = await AdminService.findAll({
      where: { admin_id: adminId },
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    // Get vendor's selected services with price counts
    const vendorServices = await VendorService.findAll({
      where: { vendor_id: vendorId },
      attributes: ["service_id", "price_count"],
    });

    const selectedServiceMap = {};
    vendorServices.forEach((vs) => {
      selectedServiceMap[vs.service_id] = vs.price_count || 0;
    });

    const servicesWithSelection = adminServices.map((service) => ({
      ...service.toJSON(),
      is_selected: selectedServiceMap.hasOwnProperty(service.id),
      price_count: selectedServiceMap[service.id] || 0,
    }));

    return res.json({
      success: true,
      data: servicesWithSelection,
    });
  } catch (error) {
    console.error("Error fetching admin services for vendor:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// NEW: Initialize all services when toggle is disabled
export const initializeVendorServices = async (req, res) => {
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

    // Get all admin services
    const adminServices = await AdminService.findAll({
      where: { admin_id: adminId },
      attributes: ["id"],
      transaction,
    });

    // Get existing price counts for this vendor
    const priceCounts = await VendorPriceList.findAll({
      where: { vendor_id: vendor_id },
      attributes: [
        "service_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
      ],
      group: ["service_id"],
      raw: true,
      transaction,
    });

    const priceCountMap = {};
    priceCounts.forEach((pc) => {
      priceCountMap[pc.service_id] = parseInt(pc.count) || 0;
    });

    // Create vendor_services for all admin services with price counts
    const vendorServicesToCreate = adminServices.map((service) => ({
      vendor_id: vendor_id,
      service_id: service.id,
      price_count: priceCountMap[service.id] || 0,
    }));

    // Use bulkCreate with ignoreDuplicates
    await VendorService.bulkCreate(vendorServicesToCreate, {
      ignoreDuplicates: true,
      transaction,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: "All services initialized for vendor",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error initializing vendor services:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};
