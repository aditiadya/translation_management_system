import db from "../../models/index.js";

const { AdminAuth, UserRoles, Roles, AdminSetup } = db;

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await AdminAuth.findByPk(req.user.id, {
      attributes: ["id", "email", "username", "is_active"],
      include: [
        {
          model: UserRoles,
          as: "role",
          include: [
            {
              model: Roles,
              as: "role_details",
              attributes: ["name", "slug"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const roleEntry = user.role?.role_details;

    // Fetch setup status for administrators
    let setup_completed = null;
    if (roleEntry?.slug === "administrator") {
      const setup = await AdminSetup.findOne({ where: { admin_id: user.id } });
      setup_completed = setup?.setup_completed ?? false;
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      is_active: user.is_active,
      role: roleEntry?.name ?? null,
      roleSlug: roleEntry?.slug ?? null,
      setup_completed,
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "Server error" });
  }
};