import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const {
  ClientPriceList,
  ClientDetails,
  ClientService,
  ClientLanguagePair,
  ClientSpecialization,
  AdminCurrency,
  AdminService,
  AdminSpecialization,
  AdminLanguagePair,
  Currency
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

// Add
export const createClientPrice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const data = pickAllowed(req.body, CLIENT_PRICE_ALLOWED_FIELDS);

    if (
      !data.client_id ||
      !data.service_id ||
      !data.language_pair_id ||
      !data.specialization_id ||
      !data.unit ||
      !data.price_per_unit ||
      !data.currency_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const client = await ClientDetails.findByPk(data.client_id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Client does not belong to your admin account",
      });
    }

    const [service, specialization, languagePair, currency] = await Promise.all([
      ClientService.findByPk(data.service_id),
      ClientSpecialization.findByPk(data.specialization_id),
      ClientLanguagePair.findByPk(data.language_pair_id),
      AdminCurrency.findByPk(data.currency_id),
    ]);

    if (!service || !specialization || !languagePair || !currency) {
      return res.status(404).json({
        success: false,
        message: "One or more related records (service, specialization, language pair, currency) not found",
      });
    }

    const existing = await ClientPriceList.findOne({
      where: {
        client_id: data.client_id,
        service_id: data.service_id,
        language_pair_id: data.language_pair_id,
        specialization_id: data.specialization_id,
        unit: data.unit,
        currency_id: data.currency_id,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This price list entry already exists",
      });
    }

    const newEntry = await ClientPriceList.create(data);
    res.status(201).json({
      success: true,
      message: "Client price list entry created successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error creating client price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Get All
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
          model: ClientService,
          as: "service",
          attributes: ["id", "service_id"],
          include: [
            {
              model: AdminService,
              as: "service",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: ClientLanguagePair,
          as: "languagePair",
          attributes: ["id", "language_pair_id"],
          include: [
            {
              model: AdminLanguagePair,
              as: "languagePair",
              attributes: ["id", "source_language_id", "target_language_id"],
            },
          ],
        },
        {
          model: ClientSpecialization,
          as: "specialization",
          attributes: ["id", "specialization_id"],
          include: [
            {
              model: AdminSpecialization,
              as: "specialization",
              attributes: ["id", "name"],
            },
          ],
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


// Get
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
          model: ClientService,
          as: "service",
          attributes: ["id", "service_id"],
          include: [
            {
              model: AdminService,
              as: "service",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: ClientLanguagePair,
          as: "languagePair",
          attributes: ["id", "language_pair_id"],
          include: [
            {
              model: AdminLanguagePair,
              as: "languagePair",
              attributes: ["id", "source_language_id", "target_language_id"],
            },
          ],
        },
        {
          model: ClientSpecialization,
          as: "specialization",
          attributes: ["id", "specialization_id"],
          include: [
            {
              model: AdminSpecialization,
              as: "specialization",
              attributes: ["id", "name"],
            },
          ],
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


// Update
export const updateClientPrice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const data = pickAllowed(req.body, CLIENT_PRICE_ALLOWED_FIELDS);

    const existing = await ClientPriceList.findByPk(id, {
      include: [{ model: ClientDetails, as: "client", attributes: ["admin_id"] }],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Client price entry not found",
      });
    }

    if (existing.client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this client price entry",
      });
    }

    await existing.update(data);

    res.json({
      success: true,
      message: "Client price entry updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Error updating client price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteClientPrice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const existing = await ClientPriceList.findOne({
      where: { id },
      include: [{ model: ClientDetails, as: "client", attributes: ["admin_id"] }],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Client price entry not found",
      });
    }

    if (existing.client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This record does not belong to your admin account",
      });
    }

    await existing.destroy();

    res.json({
      success: true,
      message: "Client price entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client price:", error);
    const err = toClientError(error);
    res.status(err.code).json(err.body);
  }
};