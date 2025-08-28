import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { AdminPaymentMethod } = db;

const ALLOWED_FIELDS = ["name", "payment_type", "bank_info", "description", "active_flag"];

// Get
export const getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await AdminPaymentMethod.findAll({
      where: { admin_id: req.user.id },
    });

    res.status(200).json({ success: true, data: methods });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Add
export const addPaymentMethod = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const newMethod = await AdminPaymentMethod.create({
      ...data,
      admin_id: req.user.id,
    });

    res.status(201).json({ success: true, data: newMethod });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Payment method with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Update
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const method = await AdminPaymentMethod.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!method) return res.status(404).json({ success: false, message: "Payment method not found" });

    await method.update(data);
    res.status(200).json({ success: true, data: method });
  } catch (error) {
    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Payment method with this name already exists" });
    }
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Delete
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const method = await AdminPaymentMethod.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!method) return res.status(404).json({ success: false, message: "Payment method not found" });

    await method.destroy();
    res.status(200).json({ success: true, message: "Payment method deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};
