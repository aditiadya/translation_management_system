import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { AdminCurrency, Currency } = db;

const ALLOWED_FIELDS = ["currencyId", "active_flag"];

const handleSequelizeError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return { message: "This currency is already added for the admin." };
  }
  return { message: error.message || "Server error" };
};

// Get
export const getAllAdminCurrencies = async (req, res) => {
  try {
    const currencies = await AdminCurrency.findAll({
      where: { admin_id: req.user.id },
      include: [{ model: Currency, as: "currency" }],
    });

    res.status(200).json({ success: true, data: currencies });
  } catch (error) {
    res.status(500).json({ success: false, ...handleSequelizeError(error) });
  }
};

// Add
export const addAdminCurrency = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const newCurrency = await AdminCurrency.create({
      admin_id: req.user.id,
      currency_id: data.currencyId,
      active_flag: data.active_flag ?? true,
    });

    res.status(201).json({ success: true, data: newCurrency });
  } catch (error) {
    res.status(500).json({ success: false, ...handleSequelizeError(error) });
  }
};

// Update
export const updateAdminCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const currency = await AdminCurrency.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!currency) {
      return res.status(404).json({ success: false, message: "Currency not found" });
    }

    if (data.currencyId !== undefined) currency.currency_id = data.currencyId;
    if (data.active_flag !== undefined) currency.active_flag = data.active_flag;

    await currency.save();

    res.status(200).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, ...handleSequelizeError(error) });
  }
};

// Delete
export const deleteAdminCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    const currency = await AdminCurrency.findOne({
      where: { id, admin_id: req.user.id },
    });

    if (!currency) {
      return res.status(404).json({ success: false, message: "Currency not found" });
    }

    await currency.destroy();

    res.status(200).json({ success: true, message: "Currency deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, ...handleSequelizeError(error) });
  }
};
