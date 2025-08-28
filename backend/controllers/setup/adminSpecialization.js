import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { AdminSpecialization } = db;

const ALLOWED_FIELDS = ["name", "active_flag"];

// Get
export const getAllSpecializations = async (req, res) => {
  try {
    const specs = await AdminSpecialization.findAll({
      where: { admin_id: req.user.id },
    });

    res.status(200).json({ success: true, data: specs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Add
export const addSpecialization = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const newSpec = await AdminSpecialization.create({
      ...data,
      admin_id: req.user.id,
    });

    res.status(201).json({ success: true, data: newSpec });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Specialization with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Update
export const updateSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const spec = await AdminSpecialization.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!spec) return res.status(404).json({ success: false, message: "Specialization not found" });

    await spec.update(data);
    res.status(200).json({ success: true, data: spec });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Specialization with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Delete
export const deleteSpecialization = async (req, res) => {
  try {
    const { id } = req.params;

    const spec = await AdminSpecialization.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!spec) return res.status(404).json({ success: false, message: "Specialization not found" });

    await spec.destroy();
    res.status(200).json({ success: true, message: "Specialization deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};