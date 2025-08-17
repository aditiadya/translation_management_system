import db from "../../models/index.js";
const { AdminUnits } = db;

export const getAllUnits = async (req, res) => {
  try {
    const units = await AdminUnits.findAll({ where: { email: req.user.email } });
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addUnit = async (req, res) => {
  try {
    const { name, active_flag, in_use, is_word } = req.body;

    const newUnit = await AdminUnits.create({
      email: req.user.email,
      name,
      active_flag: active_flag ?? true,
      in_use: in_use ?? false,
      is_word: is_word ?? false,
    });

    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active_flag, in_use, is_word } = req.body;

    const unit = await AdminUnits.findOne({ where: { id, email: req.user.email } });
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    unit.name = name ?? unit.name;
    unit.active_flag = active_flag ?? unit.active_flag;
    unit.in_use = in_use ?? unit.in_use;
    unit.is_word = is_word ?? unit.is_word;

    await unit.save();
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await AdminUnits.findOne({ where: { id, email: req.user.email } });
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    await unit.destroy();
    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
