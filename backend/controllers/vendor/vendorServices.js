import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { VendorService, VendorDetails, AdminService, VendorSettings, } = db;

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
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, VENDOR_SERVICE_ALLOWED_FIELDS);

    if (!data.vendor_id || !data.service_id) {
      return res.status(400).json({
        success: false,
        message: "vendor_id and service_id are required",
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

    const existing = await VendorService.findOne({
      where: { vendor_id: data.vendor_id, service_id: data.service_id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This vendor-service mapping already exists",
      });
    }

    const newVendorService = await VendorService.create(data);
    res.status(201).json({
      success: true,
      message: "Vendor service created successfully",
      data: newVendorService,
    });
  } catch (error) {
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

// Get all the services under a specific vendor
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
      const adminServices = await AdminService.findAll({
        where: { admin_id: adminId },
        attributes: ["id", "name", "admin_id"],
        order: [["id", "ASC"]],
      });

      return res.json({
        success: true,
        message: "Vendor works with all admin services",
        data: {
          vendor,
          services: adminServices,
        },
      });
    }

    const vendorServices = await VendorService.findAll({
      where: { vendor_id: vendor.id },
      include: [
        {
          model: AdminService,
          as: "service",
          attributes: ["id", "name", "admin_id"],
          where: { admin_id: adminId },
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.json({
      success: true,
      message: "Vendor-specific services fetched successfully",
      data: {
        vendor,
        services: vendorServices.map((v) => v.service),
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

// Delete
export const deleteVendorService = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const vendorService = await VendorService.findOne({
      where: { id },
      include: [
        { model: VendorDetails, as: "vendor", attributes: ["admin_id"] },
        { model: AdminService, as: "service", attributes: ["admin_id"] },
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

    await vendorService.destroy();
    res.json({
      success: true,
      message: "Vendor service deleted successfully",
    });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};