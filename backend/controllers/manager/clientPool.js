import db from "../../models/index.js";
import { pickAllowed, toClientError } from "../../utils/pickAllowed.js";

const { ManagerDetails, ClientPool, ClientPoolManagers } = db;

const ALLOWED_FIELDS = [
  "role_id",
  "client_pool_id",
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

export const createManager = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const body = pickAllowed(req.body, ALLOWED_FIELDS);

    const pool = await ClientPool.findOne({
      where: { id: body.client_pool_id, admin_id: req.user.id },
    });

    if (!pool) {
      return res.status(400).json({
        success: false,
        message: "Selected client pool does not exist or does not belong to you.",
      });
    }

    const manager = await ManagerDetails.create(
      {
        ...body,
        admin_id: req.user.id,
        client_pool_id: pool.id,
      },
      { transaction }
    );

    await ClientPoolManagers.create(
      {
        client_pool_id: pool.id,
        manager_id: manager.id,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Manager created and assigned to client pool successfully",
      data: manager,
    });
  } catch (error) {
    await transaction.rollback();
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};