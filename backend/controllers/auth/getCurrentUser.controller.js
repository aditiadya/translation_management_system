import db from "../../models/index.js";

const { AdminAuth, UserRoles, Roles } = db;

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

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      is_active: user.is_active,
      role: roleEntry?.name ?? null,
      roleSlug: roleEntry?.slug ?? null,
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "Server error" });
  }
};