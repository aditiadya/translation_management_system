import db from '../../models/index.js';
const { AdminLanguagePair } = db;

export const getAllLanguagePairs = async (req, res) => {
  try {
    const pairs = await AdminLanguagePair.findAll({
      where: { email: req.user.email },
      include: [
        { model: db.Language, as: "sourceLanguage", attributes: ["id", "name"] },
        { model: db.Language, as: "targetLanguage", attributes: ["id", "name"] },
      ],
    });
    res.status(200).json(pairs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addLanguagePair = async (req, res) => {
  try {
    const { source_language_id, target_language_id, active_flag } = req.body;

    const newPair = await AdminLanguagePair.create({
      email: req.user.email,
      source_language_id,
      target_language_id,
      active_flag: active_flag ?? true
    });

    res.status(201).json(newPair);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLanguagePair = async (req, res) => {
  try {
    const { id } = req.params;
    const { source_language_id, target_language_id, active_flag } = req.body;

    const pair = await AdminLanguagePair.findOne({ where: { id, email: req.user.email } });
    if (!pair) return res.status(404).json({ message: 'Language pair not found' });

    pair.source_language_id = source_language_id ?? pair.source_language_id;
    pair.target_language_id = target_language_id ?? pair.target_language_id;
    pair.active_flag = active_flag ?? pair.active_flag;

    await pair.save();
    res.status(200).json(pair);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLanguagePair = async (req, res) => {
  try {
    const { id } = req.params;
    const pair = await AdminLanguagePair.findOne({ where: { id, email: req.user.email } });
    if (!pair) return res.status(404).json({ message: 'Language pair not found' });

    await pair.destroy();
    res.status(200).json({ message: 'Language pair deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
