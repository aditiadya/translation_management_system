import db from "../../models/index.js";
const { AdminSpecialization } = db;

export const getAllSpecializations = async (req, res) => {
  try {
    const specs = await AdminSpecialization.findAll({
      where: { email: req.user.email },
    });
    res.status(200).json(specs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addSpecialization = async (req, res) => {
  try {
    const { name, active_flag } = req.body;

    const newSpec = await AdminSpecialization.create({
      email: req.user.email,
      name,
      active_flag: active_flag ?? true,
    });

    res.status(201).json(newSpec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSpecialization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, active_flag } = req.body;

    const spec = await AdminSpecialization.findOne({
      where: { id, email: req.user.email },
    });

    if (!spec) return res.status(404).json({ message: "Specialization not found" });

    spec.name = name ?? spec.name;
    spec.active_flag = active_flag ?? spec.active_flag;

    await spec.save();
    res.status(200).json(spec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSpecialization = async (req, res) => {
  try {
    const { id } = req.params;

    const spec = await AdminSpecialization.findOne({
      where: { id, email: req.user.email },
    });

    if (!spec) return res.status(404).json({ message: "Specialization not found" });

    await spec.destroy();
    res.status(200).json({ message: "Specialization deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
