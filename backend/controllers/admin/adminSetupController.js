import db from "../../models/index.js";
const { AdminAuth } = db;

export const markSetupCompleted = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await AdminAuth.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.setup_completed = true;
    await user.save();

    res.status(200).json({ message: "Setup completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};