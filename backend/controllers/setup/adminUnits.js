import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { AdminUnits } = db;

const ALLOWED_FIELDS = ["name", "active_flag", "in_use", "is_word"];

// Get
export const getAllUnits = async (req, res) => {
  try {
    const units = await AdminUnits.findAll({
      where: { admin_id: req.user.id },
    });

    res.status(200).json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Add
export const addUnit = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const newUnit = await AdminUnits.create({
      ...data,
      admin_id: req.user.id,
    });

    res.status(201).json({ success: true, data: newUnit });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Unit with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Update
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const unit = await AdminUnits.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!unit) return res.status(404).json({ success: false, message: "Unit not found" });

    await unit.update(data);
    res.status(200).json({ success: true, data: unit });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Unit with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Delete
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await AdminUnits.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!unit) return res.status(404).json({ success: false, message: "Unit not found" });

    await unit.destroy();
    res.status(200).json({ success: true, message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};
