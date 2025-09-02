import db from "../../models/index.js";
const { AdminAuth, AdminSetup } = db;


export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await AdminAuth.findByPk(req.user.id, {
      attributes: ["id", "email", "is_active"],
      include: [
        {
          model: AdminSetup,
          as: "setup",
          attributes: ["setup_completed"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      setup_completed: user.setup?.setup_completed || false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};