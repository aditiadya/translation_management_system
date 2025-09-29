import db from "../../models/index.js";
import { Op } from "sequelize";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  ClientPool,
  ClientPoolClients,
  ClientPoolManagers,
  ClientDetails,
  ManagerDetails,
  ClientPrimaryUserDetails,
} = db;
const ALLOWED_FIELDS = ["name", "client_ids", "manager_ids"];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Pool name already exists" },
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
  return { code: 500, body: { success: false, message: "Server error" } };
};

const sanitizeIds = (ids) =>
  Array.isArray(ids) ? ids.map((id) => Number(id)).filter(Boolean) : [];

// Add
export const createClientPool = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const body = pickAllowed(req.body, ALLOWED_FIELDS);
    const client_ids = sanitizeIds(body.client_ids);
    const manager_ids = sanitizeIds(body.manager_ids);

    const pool = await ClientPool.create(
      { name: body.name, admin_id: req.user.id },
      { transaction }
    );

    if (client_ids.length) {
      const validClients = await ClientDetails.findAll({
        where: { id: client_ids, admin_id: req.user.id },
        attributes: ["id"],
      });
      const validClientIds = validClients.map((c) => c.id);

      if (validClientIds.length !== client_ids.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid clients provided",
        });
      }

      const clientData = validClientIds.map((id) => ({
        client_pool_id: pool.id,
        client_id: id,
      }));
      await ClientPoolClients.bulkCreate(clientData, { transaction });
    }

    if (manager_ids.length) {
      const validManagers = await ManagerDetails.findAll({
        where: { id: manager_ids, admin_id: req.user.id },
        attributes: ["id"],
      });
      const validManagerIds = validManagers.map((m) => m.id);

      if (validManagerIds.length !== manager_ids.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid managers provided",
        });
      }

      const managerData = validManagerIds.map((id) => ({
        client_pool_id: pool.id,
        manager_id: id,
      }));
      await ClientPoolManagers.bulkCreate(managerData, { transaction });
    }

    await transaction.commit();

    const createdPool = await ClientPool.findByPk(pool.id, {
      include: [
        { model: ClientDetails, as: "clients" },
        { model: ManagerDetails, as: "managers" },
      ],
    });

    res.status(201).json({ success: true, data: createdPool });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get All
export const getAllClientPools = async (req, res) => {
  try {
    const pools = await ClientPool.findAll({
      where: { admin_id: req.user.id },
      include: [
        {
          model: ClientDetails,
          as: "clients",
          include: [
            { model: ClientPrimaryUserDetails, as: "primary_users" }, // nested include
          ],
        },
        { model: ManagerDetails, as: "managers" },
      ],
    });
    res.status(200).json({ success: true, data: pools });
  } catch (error) {
    console.error("Error in getAllClientPools:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get client pool by id
export const getClientPoolById = async (req, res) => {
  try {
    const pool = await ClientPool.findOne({
      where: { id: req.params.id, admin_id: req.user.id },
      include: [
        {
          model: ClientDetails,
          as: "clients",
          include: [
            { model: ClientPrimaryUserDetails, as: "primary_users" }, // nested include
          ],
        },
        { model: ManagerDetails, as: "managers" },
      ],
    });

    if (!pool)
      return res
        .status(404)
        .json({ success: false, message: "Client pool not found" });

    res.status(200).json({ success: true, data: pool });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Update
export const updateClientPool = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const body = pickAllowed(req.body, ALLOWED_FIELDS);
    let client_ids = body.hasOwnProperty("client_ids")
      ? sanitizeIds(body.client_ids)
      : undefined;
    let manager_ids = body.hasOwnProperty("manager_ids")
      ? sanitizeIds(body.manager_ids)
      : undefined;

    const pool = await ClientPool.findOne({
      where: { id: req.params.id, admin_id: req.user.id },
      transaction,
    });
    if (!pool) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Client pool not found" });
    }

    if (body.name) pool.name = body.name;
    await pool.save({ transaction });

    // ---- Clients update ----
    if (client_ids !== undefined) {
      if (client_ids.length === 0) {
        await ClientPoolClients.destroy({
          where: { client_pool_id: pool.id },
          transaction,
        });
      } else {
        const validClients = await ClientDetails.findAll({
          where: { id: client_ids, admin_id: req.user.id },
          attributes: ["id"],
          transaction,
        });
        client_ids = validClients.map((c) => c.id);

        await ClientPoolClients.destroy({
          where: {
            client_pool_id: pool.id,
            client_id: { [Op.notIn]: client_ids },
          },
          transaction,
        });

        const existingClients = await ClientPoolClients.findAll({
          where: { client_pool_id: pool.id },
          transaction,
        });
        const existingClientIds = existingClients.map((c) => c.client_id);

        const newClients = client_ids.filter(
          (id) => !existingClientIds.includes(id)
        );
        if (newClients.length) {
          const clientData = newClients.map((id) => ({
            client_pool_id: pool.id,
            client_id: id,
          }));
          await ClientPoolClients.bulkCreate(clientData, { transaction });
        }
      }
    }

    // ---- Managers update ----
    if (manager_ids !== undefined) {
      if (manager_ids.length === 0) {
        await ClientPoolManagers.destroy({
          where: { client_pool_id: pool.id },
          transaction,
        });
      } else {
        const validManagers = await ManagerDetails.findAll({
          where: { id: manager_ids, admin_id: req.user.id },
          attributes: ["id"],
          transaction,
        });
        const validManagerIds = validManagers.map((m) => m.id);

        if (validManagerIds.length !== manager_ids.length) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: "Invalid managers provided",
          });
        }

        await ClientPoolManagers.destroy({
          where: {
            client_pool_id: pool.id,
            manager_id: { [Op.notIn]: validManagerIds },
          },
          transaction,
        });

        const existingManagers = await ClientPoolManagers.findAll({
          where: { client_pool_id: pool.id },
          transaction,
        });
        const existingManagerIds = existingManagers.map((m) => m.manager_id);

        const newManagers = validManagerIds.filter(
          (id) => !existingManagerIds.includes(id)
        );
        if (newManagers.length) {
          const managerData = newManagers.map((id) => ({
            client_pool_id: pool.id,
            manager_id: id,
          }));
          await ClientPoolManagers.bulkCreate(managerData, { transaction });
        }
      }
    }

    await transaction.commit();

    const updatedPool = await ClientPool.findByPk(pool.id, {
      include: [
        { model: ClientDetails, as: "clients" },
        { model: ManagerDetails, as: "managers" },
      ],
    });

    res.status(200).json({ success: true, data: updatedPool });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteClientPool = async (req, res) => {
  try {
    const pool = await ClientPool.findOne({
      where: { id: req.params.id, admin_id: req.user.id },
    });
    if (!pool)
      return res
        .status(404)
        .json({ success: false, message: "Client pool not found" });

    await pool.destroy();
    res
      .status(200)
      .json({ success: true, message: "Client pool deleted successfully" });
  } catch (error) {
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};