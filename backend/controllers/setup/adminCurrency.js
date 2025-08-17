import db from "../../models/index.js";
const { AdminCurrency, Currency } = db;

// ✅ Get all currencies for logged-in admin
export const getAllAdminCurrencies = async (req, res) => {
  try {
    const currencies = await AdminCurrency.findAll({
      where: { email: req.user.email },
      include: [{ model: Currency, as: "currency" }],
    });
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add a new currency
export const addAdminCurrency = async (req, res) => {
  try {
    const { currencyId, active_flag } = req.body;

    const newCurrency = await AdminCurrency.create({
      email: req.user.email,
      currencyId,
      active_flag: active_flag ?? true,
    });

    res.status(201).json(newCurrency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a currency
export const updateAdminCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { currencyId, active_flag } = req.body;

    const currency = await AdminCurrency.findOne({
      where: { id, email: req.user.email },
    });

    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }

    currency.currencyId = currencyId ?? currency.currencyId;
    currency.active_flag = active_flag ?? currency.active_flag;

    await currency.save();
    res.status(200).json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a currency
export const deleteAdminCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    const currency = await AdminCurrency.findOne({
      where: { id, email: req.user.email },
    });

    if (!currency) {
      return res.status(404).json({ message: "Currency not found" });
    }

    await currency.destroy();
    res.status(200).json({ message: "Currency deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
