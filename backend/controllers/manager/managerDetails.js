import crypto from "crypto";
import db from "../../models/index.js";
const { AdminAuth, ManagerDetails, UserRoles } = db;
import { pickAllowed } from "../../utils/pickAllowed.js";

const ALLOWED_FIELDS = [
  "role_id",
  "client_pool",
  "first_name",
  "last_name",
  "gender",
  "email",
  "phone",
  "teams_id",
  "zoom_id",
  "timezone",
  "can_login",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Email already exists" },
    };
  }
  if (error?.name === "SequelizeValidationError") {
    return {
      code: 400,
      body: {
        success: false,
        message: "Invalid data",
        details: error.errors?.map((e) => e.message),
      },
    };
  }
  return {
    code: 500,
    body: { success: false, message: "Server error" },
  };
};

// Add
export const createManager = async (req, res) => {
  const adminId = req.user.id;
  const data = pickAllowed(req.body, ALLOWED_FIELDS);

  try {
    const activationToken = data.can_login
      ? crypto.randomBytes(32).toString("hex")
      : null;

    const managerAuth = await AdminAuth.create({
      email: data.email,
      activation_token: activationToken,
    });

    const optionalFields = [
      "client_pool",
      "gender",
      "phone",
      "teams_id",
      "zoom_id",
      "timezone",
    ];

    optionalFields.forEach((field) => {
      if (data[field] === "") {
        data[field] = null;
      }
    });

    await ManagerDetails.create({
      auth_id: managerAuth.id,
      admin_id: adminId,
      client_pool: data.client_pool,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      phone: data.phone,
      teams_id: data.teams_id,
      zoom_id: data.zoom_id,
      timezone: data.timezone,
      can_login: data.can_login,
    });

    await UserRoles.create({
      auth_id: managerAuth.id,
      role_id: data.role_id,
    });

    let activationLink = null;
    if (data.can_login) {
      activationLink = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/activate/${activationToken}`;
    }

    return res.status(201).json({
      success: true,
      message: "Manager created successfully",
      activationLink,
    });
  } catch (err) {
    console.error(err);
    const errorResponse = toClientError(err);
    return res.status(errorResponse.code).json(errorResponse.body);
  }
};

// Update
export const updateManager = async (req, res) => {
  const managerId = req.params.id;
  const adminId = req.user.id;
  const data = pickAllowed(req.body, ALLOWED_FIELDS);

  try {
    if (data.email) {
      await AdminAuth.update(
        { email: data.email },
        {
          where: {
            id: (
              await ManagerDetails.findOne({
                where: { id: managerId, admin_id: adminId },
              })
            ).auth_id,
          },
        }
      );
    }

    const [updated] = await ManagerDetails.update(data, {
      where: { id: managerId, admin_id: adminId },
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "No manager found." });

    if (data.role_id) {
      const managerAuth = await ManagerDetails.findOne({
        where: { id: managerId, admin_id: adminId },
      });

      await UserRoles.update(
        { role_id: data.role_id },
        { where: { auth_id: managerAuth.auth_id } }
      );
    }

    const updatedManager = await ManagerDetails.findOne({
      where: { id: managerId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: UserRoles, as: "role", attributes: ["role_id"] },
      ],
    });

    return res.status(200).json({ success: true, data: updatedManager });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get
export const getManagerById = async (req, res) => {
  const managerId = req.params.id;
  const adminId = req.user.id;

  try {
    const data = await ManagerDetails.findOne({
      where: { id: managerId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: UserRoles, as: "role", attributes: ["role_id"] },
        { model: AdminAuth, as: "admin", attributes: ["id", "email"] },
      ],
    });

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "No manager found." });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all managers
export const getAllManagers = async (req, res) => {
  const adminId = req.user.id;

  try {
    const managers = await ManagerDetails.findAll({
      where: { admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: UserRoles, as: "role", attributes: ["role_id"] },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ success: true, data: managers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete
export const deleteManager = async (req, res) => {
  const managerId = req.params.id;
  const adminId = req.user.id;

  try {
    const manager = await ManagerDetails.findOne({
      where: { id: managerId, admin_id: adminId },
    });

    if (!manager)
      return res
        .status(404)
        .json({ success: false, message: "No manager found." });

    await UserRoles.destroy({ where: { auth_id: manager.auth_id } });
    await AdminAuth.destroy({ where: { id: manager.auth_id } });

    await ManagerDetails.destroy({ where: { id: managerId } });

    return res
      .status(200)
      .json({ success: true, message: "Manager deleted successfully" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};
