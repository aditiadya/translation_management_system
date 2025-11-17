import Joi from "joi";
import db from "../../models/index.js";
const { Roles, Permissions } = db;

const roleIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const getManagerRoles = async (req, res) => {
  try {
    const adminId = req.user.id;

    const roles = await Roles.findAll({
      where: { category: "manager" },
      include: [
        {
          model: Permissions,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (err) {
    console.error("GET ROLES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching roles.",
    });
  }
};

export const getManagerRoleById = async (req, res) => {
  try {
    const { error } = roleIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { id } = req.params;

    const role = await Roles.findOne({
      where: { id, category: "manager" },
      include: [
        {
          model: Permissions,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (err) {
    console.error("GET ROLE BY ID ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the role.",
    });
  }
};
