import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  ClientPriceList,
  ClientDetails,
  AdminCurrency,
  AdminService,
  AdminSpecialization,
  AdminLanguagePair,
  Currency,
  Language,
} = db;

const CLIENT_PRICE_ALLOWED_FIELDS = [
  "client_id",
  "service_id",
  "language_pair_id",
  "specialization_id",
  "unit",
  "price_per_unit",
  "currency_id",
  "note",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Duplicate entry" },
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

// CREATE
export const createClientPrice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, CLIENT_PRICE_ALLOWED_FIELDS);

    const requiredFields = [
      "client_id",
      "service_id",
      "language_pair_id",
      "specialization_id",
      "unit",
      "price_per_unit",
      "currency_id",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: `Missing field: ${field}` });
      }
    }

    // Validate client
    const client = await ClientDetails.findOne({
      where: { id: data.client_id, admin_id: adminId },
      transaction,
    });

    if (!client) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: "Client access denied or not found" });
    }

    // Validate service (directly from admin)
    const adminService = await AdminService.findOne({
      where: { id: data.service_id, admin_id: adminId },
      transaction,
    });

    if (!adminService) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Validate language pair (directly from admin)
    const adminLP = await AdminLanguagePair.findOne({
      where: { id: data.language_pair_id, admin_id: adminId },
      transaction,
    });

    if (!adminLP) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Language pair not found" });
    }

    // Validate specialization (directly from admin)
    const adminSpec = await AdminSpecialization.findOne({
      where: { id: data.specialization_id, admin_id: adminId },
      transaction,
    });

    if (!adminSpec) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Specialization not found" });
    }

    // Validate currency
    const currency = await AdminCurrency.findByPk(data.currency_id, { transaction });
    if (!currency) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: "Invalid currency_id" });
    }

    // Check for duplicates
    const existing = await ClientPriceList.findOne({
      where: {
        client_id: data.client_id,
        service_id: data.service_id,
        language_pair_id: data.language_pair_id,
        specialization_id: data.specialization_id,
        unit: data.unit,
        currency_id: data.currency_id,
      },
      transaction,
    });

    if (existing) {
      await transaction.rollback();
      return res.status(409).json({ success: false, message: "Price entry already exists" });
    }

    const newEntry = await ClientPriceList.create(data, { transaction });
    await transaction.commit();

    return res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// GET ALL
export const getAllClientPrices = async (req, res) => {
  try {
    const adminId = req.user.id;

    const clientPrices = await ClientPriceList.findAll({
      include: [
        {
          model: ClientDetails,
          as: "client",
          attributes: ["id", "company_name", "admin_id"],
          where: { admin_id: adminId },
        },
        {
          model: AdminService,
          as: "service",
          attributes: ["id", "name"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id"],
          include: [
            {
              model: Language,
              as: "sourceLanguage",
              attributes: ["id", "name", "code"],
            },
            {
              model: Language,
              as: "targetLanguage",
              attributes: ["id", "name", "code"],
            },
          ],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name"],
        },
        {
          model: AdminCurrency,
          as: "currency",
          include: [
            {
              model: Currency,
              as: "currency",
              attributes: ["id", "name", "code", "symbol"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: clientPrices,
    });
  } catch (error) {
    console.error("Error fetching client prices:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// GET BY ID
export const getClientPriceById = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const entry = await ClientPriceList.findOne({
      where: { id },
      include: [
        {
          model: ClientDetails,
          as: "client",
          attributes: ["id", "company_name", "admin_id"],
        },
        {
          model: AdminService,
          as: "service",
          attributes: ["id", "name"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id"],
          include: [
            {
              model: Language,
              as: "sourceLanguage",
              attributes: ["id", "name", "code"],
            },
            {
              model: Language,
              as: "targetLanguage",
              attributes: ["id", "name", "code"],
            },
          ],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name"],
        },
        {
          model: AdminCurrency,
          as: "currency",
          include: [
            {
              model: Currency,
              as: "currency",
              attributes: ["id", "name", "code", "symbol"],
            },
          ],
        },
      ],
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Client price entry not found",
      });
    }

    if (entry.client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record does not belong to your admin account",
      });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error fetching client price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// GET FOR CLIENT - NEW ENDPOINT
export const getClientPriceListForClient = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id: clientId } = req.params;

    const client = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
      attributes: ["id", "company_name", "admin_id"],
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or does not belong to your admin account",
      });
    }

    // Fetch all admin services, language pairs, specializations
    const services = await AdminService.findAll({
      where: { admin_id: adminId },
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    const languagePairs = await AdminLanguagePair.findAll({
      where: { admin_id: adminId },
      attributes: ["id", "source_language_id", "target_language_id"],
      include: [
        {
          model: Language,
          as: "sourceLanguage",
          attributes: ["id", "name", "code"],
        },
        {
          model: Language,
          as: "targetLanguage",
          attributes: ["id", "name", "code"],
        },
      ],
      order: [["id", "ASC"]],
    });

    const specializations = await AdminSpecialization.findAll({
      where: { admin_id: adminId },
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    const clientPrices = await ClientPriceList.findAll({
      where: { client_id: clientId },
      include: [
        {
          model: AdminService,
          as: "service",
          attributes: ["id", "name"],
        },
        {
          model: AdminLanguagePair,
          as: "languagePair",
          attributes: ["id", "source_language_id", "target_language_id"],
          include: [
            {
              model: Language,
              as: "sourceLanguage",
              attributes: ["id", "name", "code"],
            },
            {
              model: Language,
              as: "targetLanguage",
              attributes: ["id", "name", "code"],
            },
          ],
        },
        {
          model: AdminSpecialization,
          as: "specialization",
          attributes: ["id", "name"],
        },
        {
          model: AdminCurrency,
          as: "currency",
          include: [
            {
              model: Currency,
              as: "currency",
              attributes: ["id", "name", "code", "symbol"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({
      success: true,
      data: {
        client,
        dropdowns: {
          services,
          languagePairs,
          specializations,
        },
        priceList: clientPrices,
      },
    });
  } catch (error) {
    console.error("Error fetching client price list:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// UPDATE
export const updateClientPrice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, CLIENT_PRICE_ALLOWED_FIELDS);

    const existing = await ClientPriceList.findByPk(id, {
      include: [{ model: ClientDetails, as: "client", attributes: ["admin_id"] }],
      transaction,
    });

    if (!existing) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Client price entry not found",
      });
    }

    if (existing.client.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "You do not have access to this client price entry",
      });
    }

    await existing.update(data, { transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: "Client price entry updated successfully",
      data: existing,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating client price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// DELETE
export const deleteClientPrice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const existing = await ClientPriceList.findOne({
      where: { id },
      include: [{ model: ClientDetails, as: "client", attributes: ["admin_id"] }],
      transaction,
    });

    if (!existing) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Client price entry not found",
      });
    }

    if (existing.client.admin_id !== adminId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: "Access denied: This record does not belong to your admin account",
      });
    }

    await existing.destroy({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: "Client price entry deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting client price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};
