import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import Joi from "joi";

const {
  UnitBasedReceivables,
  ProjectDetails,
  AdminService,
  AdminLanguagePair,
  AdminUnits,  
  AdminCurrency,
  Currency,
  ProjectInputFiles,
  Language,
} = db;

const ALLOWED_FIELDS = [
  "project_id",
  "po_number",
  "service_id",
  "language_pair_id",
  "unit_amount",
  "unit_id",
  "price_per_unit",
  "subtotal",
  "currency_id",
  "file_id",
  "internal_note",
];

const createSchema = Joi.object({
  project_id: Joi.number().integer().required(),
  po_number: Joi.string().allow("", null).optional(),
  service_id: Joi.number().integer().required(),
  language_pair_id: Joi.number().integer().allow(null).optional(),
  unit_amount: Joi.number().positive().required(),
  unit_id: Joi.number().integer().required(),
  price_per_unit: Joi.number().positive().required(),
  subtotal: Joi.number().positive().required(),
  currency_id: Joi.number().integer().required(),
  file_id: Joi.number().integer().allow(null).optional(),
  internal_note: Joi.string().allow("", null).optional(),
});

const updateSchema = Joi.object({
  po_number: Joi.string().allow("", null).optional(),
  service_id: Joi.number().integer().optional(),
  language_pair_id: Joi.number().integer().allow(null).optional(),
  unit_amount: Joi.number().positive().optional(),
  unit_id: Joi.number().integer().optional(),
  price_per_unit: Joi.number().positive().optional(),
  subtotal: Joi.number().positive().optional(),
  currency_id: Joi.number().integer().optional(),
  file_id: Joi.number().integer().allow(null).optional(),
  internal_note: Joi.string().allow("", null).optional(),
});

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
  return { code: 500, body: { success: false, message: "Server error" } };
};

// Helper: Get receivable with associations
const getWithAssociations = (transaction = null) => ({
  include: [
    {
      model: ProjectDetails,
      as: "project",
      attributes: ["id", "project_name"],
    },
    {
      model: AdminService,
      as: "service",
      attributes: ["id", "name"],
    },
    {
      model: AdminLanguagePair,
      as: "languagePair",
      attributes: ["id"],
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
      model: AdminUnits,
      as: "unit",
      attributes: ["id", "name"],
    },
    {
      model: AdminCurrency,
      as: "currency",
      attributes: ["id"],
      include: [
        {
          model: Currency,
          as: "currency",
          attributes: ["id", "code", "symbol", "name"],
        },
      ],
    },
    {
      model: ProjectInputFiles,
      as: "file",
      attributes: ["id", "file_name", "file_code"],
    },
  ],
  ...(transaction && { transaction }),
});

// CREATE
export const createUnitBasedReceivable = async (req, res) => {
  const adminId = req.user.id;
  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  // Handle empty strings
  ["po_number", "language_pair_id", "file_id", "internal_note"].forEach(
    (k) => {
      if (payload[k] === "") payload[k] = null;
    }
  );

  const { error } = createSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    // Validate project ownership
    const project = await ProjectDetails.findOne({
      where: { id: payload.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(400)
        .json({ success: false, message: "Project not found" });

    // Validate service
    const service = await AdminService.findOne({
      where: { id: payload.service_id, admin_id: adminId },
    });
    if (!service)
      return res
        .status(400)
        .json({ success: false, message: "Service not found" });

    // Validate language pair if provided
    if (payload.language_pair_id) {
      const languagePair = await AdminLanguagePair.findOne({
        where: { id: payload.language_pair_id, admin_id: adminId },
      });
      if (!languagePair)
        return res
          .status(400)
          .json({ success: false, message: "Language pair not found" });
    }

    // Validate unit
    const unit = await AdminUnits.findOne({
      where: { id: payload.unit_id, admin_id: adminId },
    });
    if (!unit)
      return res
        .status(400)
        .json({ success: false, message: "Unit not found" });

    // Validate currency
    const currency = await AdminCurrency.findOne({
      where: { id: payload.currency_id, admin_id: adminId },
    });
    if (!currency)
      return res
        .status(400)
        .json({ success: false, message: "Currency not found" });

    // Validate file if provided
    if (payload.file_id) {
      const file = await ProjectInputFiles.findOne({
        where: { id: payload.file_id, project_id: payload.project_id },
      });
      if (!file)
        return res
          .status(400)
          .json({ success: false, message: "File not found for this project" });
    }

    // Create receivable
    const receivable = await UnitBasedReceivables.create(payload);

    // Fetch with associations
    const receivableWithDetails = await UnitBasedReceivables.findByPk(
      receivable.id,
      getWithAssociations()
    );

    return res.status(201).json({
      success: true,
      message: "Unit-based receivable created successfully",
      data: receivableWithDetails,
    });
  } catch (err) {
    console.error("createUnitBasedReceivable err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// GET ALL (by project)
export const getAllUnitBasedReceivables = async (req, res) => {
  const adminId = req.user.id;
  const { project_id, page = 1, limit = 25 } = req.query;

  if (!project_id)
    return res
      .status(400)
      .json({ success: false, message: "project_id is required" });

  try {
    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const receivables = await UnitBasedReceivables.findAndCountAll({
      where: { project_id },
      ...getWithAssociations(),
      order: [["id", "DESC"]],
      offset,
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      meta: {
        total: receivables.count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      data: receivables.rows,
    });
  } catch (err) {
    console.error("getAllUnitBasedReceivables err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET BY ID
export const getUnitBasedReceivableById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const receivable = await UnitBasedReceivables.findOne({
      where: { id },
      ...getWithAssociations(),
    });

    if (!receivable)
      return res
        .status(404)
        .json({ success: false, message: "Receivable not found" });

    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: receivable.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });

    return res.status(200).json({ success: true, data: receivable });
  } catch (err) {
    console.error("getUnitBasedReceivableById err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
export const updateUnitBasedReceivable = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const payload = pickAllowed(
    req.body,
    ALLOWED_FIELDS.filter((f) => f !== "project_id")
  );

  // Handle empty strings
  ["po_number", "language_pair_id", "file_id", "internal_note"].forEach(
    (k) => {
      if (payload[k] === "") payload[k] = null;
    }
  );

  const { error } = updateSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const existing = await UnitBasedReceivables.findByPk(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Receivable not found" });

    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: existing.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });

    // Validate service if provided
    if (payload.service_id) {
      const service = await AdminService.findOne({
        where: { id: payload.service_id, admin_id: adminId },
      });
      if (!service)
        return res
          .status(400)
          .json({ success: false, message: "Service not found" });
    }

    // Validate language pair if provided
    if (payload.language_pair_id) {
      const languagePair = await AdminLanguagePair.findOne({
        where: { id: payload.language_pair_id, admin_id: adminId },
      });
      if (!languagePair)
        return res
          .status(400)
          .json({ success: false, message: "Language pair not found" });
    }

    // Validate unit if provided
    if (payload.unit_id) {
      const unit = await AdminUnits.findOne({
        where: { id: payload.unit_id, admin_id: adminId },
      });
      if (!unit)
        return res
          .status(400)
          .json({ success: false, message: "Unit not found" });
    }

    // Validate currency if provided
    if (payload.currency_id) {
      const currency = await AdminCurrency.findOne({
        where: { id: payload.currency_id, admin_id: adminId },
      });
      if (!currency)
        return res
          .status(400)
          .json({ success: false, message: "Currency not found" });
    }

    // Validate file if provided
    if (payload.file_id) {
      const file = await ProjectInputFiles.findOne({
        where: { id: payload.file_id, project_id: existing.project_id },
      });
      if (!file)
        return res
          .status(400)
          .json({
            success: false,
            message: "File not found for this project",
          });
    }

    // Update
    await UnitBasedReceivables.update(payload, { where: { id } });

    // Fetch updated
    const updated = await UnitBasedReceivables.findByPk(
      id,
      getWithAssociations()
    );

    return res.status(200).json({
      success: true,
      message: "Receivable updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("updateUnitBasedReceivable err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// DELETE
export const deleteUnitBasedReceivable = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const receivable = await UnitBasedReceivables.findByPk(id);
    if (!receivable)
      return res
        .status(404)
        .json({ success: false, message: "Receivable not found" });

    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: receivable.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });

    await UnitBasedReceivables.destroy({ where: { id } });

    return res
      .status(200)
      .json({ success: true, message: "Receivable deleted successfully" });
  } catch (err) {
    console.error("deleteUnitBasedReceivable err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
