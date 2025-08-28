import db from "../../models/index.js";
const { AdminProfile } = db;

export const markSetupCompleted = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await AdminProfile.findOne({ where: { admin_id: userId } });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.setup_completed) {
      return res.status(200).json({ message: "Setup already completed" });
    }

    user.setup_completed = true;
    await user.save();

    res.status(200).json({ message: "Setup completed successfully" });
  } catch (err) {
    next(err);
  }
};
