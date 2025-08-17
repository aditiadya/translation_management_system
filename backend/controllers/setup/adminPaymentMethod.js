import db from "../../models/index.js";
const { AdminPaymentMethod } = db;

export const getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await AdminPaymentMethod.findAll({
      where: { email: req.user.email },
    });
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addPaymentMethod = async (req, res) => {
  try {
    const { name, payment_type, bank_info, description, active } = req.body;

    const newMethod = await AdminPaymentMethod.create({
      email: req.user.email,
      name,
      payment_type,
      bank_info,
      description,
      active: active ?? true,
    });

    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, payment_type, bank_info, description, active } = req.body;

    const method = await AdminPaymentMethod.findOne({
      where: { id, email: req.user.email },
    });

    if (!method)
      return res.status(404).json({ message: "Payment method not found" });

    method.name = name ?? method.name;
    method.payment_type = payment_type ?? method.payment_type;
    method.bank_info = bank_info ?? method.bank_info;
    method.description = description ?? method.description;
    method.active = active ?? method.active;

    await method.save();
    res.status(200).json(method);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const method = await AdminPaymentMethod.findOne({
      where: { id, email: req.user.email },
    });

    if (!method)
      return res.status(404).json({ message: "Payment method not found" });

    await method.destroy();
    res.status(200).json({ message: "Payment method deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
