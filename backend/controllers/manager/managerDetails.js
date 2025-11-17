import crypto from "crypto";
import db from "../../models/index.js";
const { AdminAuth, ManagerDetails, UserRoles, ClientPool, ClientPoolManagers, Roles } =
  db;
import { pickAllowed } from "../../utils/pickAllowed.js";

const ALLOWED_FIELDS = [
  "role_id",
  "first_name",
  "last_name",
  "gender",
  "email",
  "phone",
  "teams_id",
  "zoom_id",
  "timezone",
  "can_login",
  "client_pool_id",
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
  let data = pickAllowed(req.body, ALLOWED_FIELDS);

  try {
    const optionalFields = [
      "client_pool_id",
      "gender",
      "phone",
      "teams_id",
      "zoom_id",
      "timezone",
    ];
    optionalFields.forEach((field) => {
      if (data[field] === "") data[field] = null;
    });

    let clientPoolId = data.client_pool_id || null;

    if (clientPoolId) {
      const pool = await ClientPool.findOne({
        where: { id: clientPoolId, admin_id: adminId },
      });

      if (!pool) {
        return res.status(400).json({
          success: false,
          message: "Client pool does not belong to this admin",
        });
      }
    }

    const roleExists = await Roles.findByPk(data.role_id);
    if (!roleExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid role id",
      });
    }

    const transaction = await AdminAuth.sequelize.transaction();

    try {
      const activationToken = data.can_login
        ? crypto.randomBytes(32).toString("hex")
        : null;

      const managerAuth = await AdminAuth.create(
        {
          email: data.email,
          activation_token: activationToken,
        },
        { transaction }
      );

      const manager = await ManagerDetails.create(
        {
          auth_id: managerAuth.id,
          admin_id: adminId,
          client_pool_id: clientPoolId,
          first_name: data.first_name,
          last_name: data.last_name,
          gender: data.gender,
          phone: data.phone,
          teams_id: data.teams_id,
          zoom_id: data.zoom_id,
          timezone: data.timezone,
          can_login: data.can_login,
        },
        { transaction }
      );

      await UserRoles.create(
        {
          auth_id: managerAuth.id,
          role_id: data.role_id,
        },
        { transaction }
      );

      if (clientPoolId) {
        await ClientPoolManagers.create(
          {
            client_pool_id: clientPoolId,
            manager_id: manager.id,
          },
          { transaction }
        );
      }

      await transaction.commit();

      const activationLink =
        data.can_login && activationToken
          ? `${process.env.FRONTEND_URL || "http://localhost:3000"}/activate/${activationToken}`
          : null;

      return res.status(201).json({
        success: true,
        message: "Manager created successfully",
        activationLink,
      });
    } catch (err) {
      await transaction.rollback();
      console.error(err);
      const errorResponse = toClientError(err);
      return res.status(errorResponse.code).json(errorResponse.body);
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid request",
    });
  }
};

// Update
export const updateManager = async (req, res) => {
  const managerId = req.params.id;
  const adminId = req.user.id;
  const data = pickAllowed(req.body, ALLOWED_FIELDS);

  try {
    const updatedManager = await AdminAuth.sequelize.transaction(async (transaction) => {
      const manager = await ManagerDetails.findOne({
        where: { id: managerId, admin_id: adminId },
        transaction,
      });

      if (!manager) {
        throw new Error("No manager found.");
      }

      if (data.email) {
        await AdminAuth.update(
          { email: data.email },
          { where: { id: manager.auth_id }, transaction }
        );
      }

      if (data.role_id) {
        await UserRoles.update(
          { role_id: data.role_id },
          { where: { auth_id: manager.auth_id }, transaction }
        );
      }

      if (data.client_pool_id !== undefined) {
        const newPoolId = data.client_pool_id || null;

        if (newPoolId) {
          const pool = await ClientPool.findOne({
            where: { id: newPoolId, admin_id: adminId },
            transaction,
          });
          if (!pool) throw new Error("Client pool does not belong to this admin");
        }

        await ManagerDetails.update(
          { ...data, client_pool_id: newPoolId },
          { where: { id: managerId, admin_id: adminId }, transaction }
        );

        await ClientPoolManagers.destroy({ where: { manager_id: managerId }, transaction });
        if (newPoolId) {
          await ClientPoolManagers.create(
            { client_pool_id: newPoolId, manager_id: managerId },
            { transaction }
          );
        }
      } else {
        await ManagerDetails.update(
          data,
          { where: { id: managerId, admin_id: adminId }, transaction }
        );
      }

      return await ManagerDetails.findOne({
        where: { id: managerId, admin_id: adminId },
        include: [
          { model: AdminAuth, as: "auth", attributes: ["email"] },
          { model: UserRoles, as: "role", attributes: ["role_id"] },
          { model: ClientPool, as: "client_pool", attributes: ["id", "name"] },
        ],
        transaction,
      });
    });

    return res.status(200).json({ success: true, data: updatedManager });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code || 500).json(err.body || { success: false, message: error.message });
  }
};

// Get manager by ID
export const getManagerById = async (req, res) => {
  const managerId = req.params.id;
  const adminId = req.user.id;

  try {
    const data = await ManagerDetails.findOne({
      where: { id: managerId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        {
          model: UserRoles,
          as: "role",
          attributes: ["role_id"],
          include: [
            {
              model: Roles,
              as: "role_details",
              attributes: ["name", "slug", "category"],
            },
          ],
        },
        { model: AdminAuth, as: "admin", attributes: ["id", "email"] },
        { model: ClientPool, as: "client_pool", attributes: ["id", "name"] },
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
        {
          model: UserRoles,
          as: "role",
          attributes: ["role_id"],
          include: [
            {
              model: Roles,
              as: "role_details",
              attributes: ["name", "slug", "category"],
            },
          ],
        },
        { model: ClientPool, as: "client_pool", attributes: ["id", "name"] },
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