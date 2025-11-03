import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { AdminLanguagePair, Language } = db;

const ALLOWED_FIELDS = ["source_language_id", "target_language_id", "active_flag"];

// Get
export const getAllLanguagePairs = async (req, res) => {
  try {
    const pairs = await AdminLanguagePair.findAll({
      where: { admin_id: req.user.id },
      include: [
        { model: Language, as: "sourceLanguage", attributes: ["id", "name"] },
        { model: Language, as: "targetLanguage", attributes: ["id", "name"] },
      ],
    });

    res.status(200).json({ success: true, data: pairs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Add
export const addLanguagePair = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const newPair = await AdminLanguagePair.create({
      ...data,
      admin_id: req.user.id,
    });

    res.status(201).json({ success: true, data: newPair });
  } catch (error) {
    console.error("Error adding language pair:", error);
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Update
export const updateLanguagePair = async (req, res) => {
  try {
    const { id } = req.params;
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const pair = await AdminLanguagePair.findOne({ where: { id, admin_id: req.user.id } });
    if (!pair) return res.status(404).json({ success: false, message: "Language pair not found" });

    await pair.update(data);
    res.status(200).json({ success: true, data: pair });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};

// Delete
export const deleteLanguagePair = async (req, res) => {
  try {
    const { id } = req.params;
    const pair = await AdminLanguagePair.findOne({ where: { id, admin_id: req.user.id } });

    if (!pair) return res.status(404).json({ success: false, message: "Language pair not found" });

    await pair.destroy();
    res.status(200).json({ success: true, message: "Language pair deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", details: error.message });
  }
};
