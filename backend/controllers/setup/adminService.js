import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { AdminService } = db;

const ALLOWED_FIELDS = ["name", "active_flag"];

// Get
export const getAllServices = async (req, res) => {
  try {
    const services = await AdminService.findAll({
      where: { admin_id: req.user.id },
    });

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Add
export const addService = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const newService = await AdminService.create({
      ...data,
      admin_id: req.user.id,
    });

    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Service with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Update
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const service = await AdminService.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    await service.update(data);
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Service with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Delete
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await AdminService.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    await service.destroy();
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};
