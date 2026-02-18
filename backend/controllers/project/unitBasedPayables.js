import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import Joi from "joi";

const {
  UnitBasedPayables,
  ProjectDetails,
  JobDetails,
  AdminUnits,
  AdminCurrency,
  Currency,
  JobInputFiles,
} = db;

const ALLOWED_FIELDS = [
  "project_id",
  "job_id",
  "client_id",
  "vendor_id",
  "unit_amount",
  "unit_id",
  "price_per_unit",
  "subtotal",
  "currency_id",
  "file_id",
  "note_for_vendor",
  "internal_note",
];

const createSchema = Joi.object({
  project_id: Joi.number().integer().required(),
  job_id: Joi.number().integer().required(),
  client_id: Joi.number().integer().required(),
  vendor_id: Joi.number().integer().required(),
  unit_amount: Joi.number().positive().required(),
  unit_id: Joi.number().integer().required(),
  price_per_unit: Joi.number().positive().required(),
  subtotal: Joi.number().positive().required(),
  currency_id: Joi.number().integer().required(),
  file_id: Joi.number().integer().allow(null).optional(),
  note_for_vendor: Joi.string().allow("", null).optional(),
  internal_note: Joi.string().allow("", null).optional(),
});

const updateSchema = Joi.object({
  job_id: Joi.number().integer().optional(),
  client_id: Joi.number().integer().optional(),
  vendor_id: Joi.number().integer().optional(),
  unit_amount: Joi.number().positive().optional(),
  unit_id: Joi.number().integer().optional(),
  price_per_unit: Joi.number().positive().optional(),
  subtotal: Joi.number().positive().optional(),
  currency_id: Joi.number().integer().optional(),
  file_id: Joi.number().integer().allow(null).optional(),
  note_for_vendor: Joi.string().allow("", null).optional(),
  internal_note: Joi.string().allow("", null).optional(),
});

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return { code: 400, body: { success: false, message: "Duplicate entry" } };
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

const getWithAssociations = (transaction = null) => ({
  include: [
    {
      model: ProjectDetails,
      as: "project",
      attributes: ["id", "project_name"],
    },
    {
      model: JobDetails,
      as: "job",
      attributes: ["id", "name"],
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
      model: JobInputFiles,
      as: "file",
      attributes: ["id", "file_name", "file_code"],
    },
  ],
  ...(transaction && { transaction }),
});

// CREATE
export const createUnitBasedPayable = async (req, res) => {
  const adminId = req.user.id;
  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  ["file_id", "note_for_vendor", "internal_note"].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = createSchema.validate(payload);
  if (error)
    return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const project = await ProjectDetails.findOne({
      where: { id: payload.project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(400).json({ success: false, message: "Project not found" });

    const job = await JobDetails.findOne({
      where: { id: payload.job_id, project_id: payload.project_id },
    });
    if (!job)
      return res.status(400).json({ success: false, message: "Job not found for this project" });

    const unit = await AdminUnits.findOne({
      where: { id: payload.unit_id, admin_id: adminId },
    });
    if (!unit)
      return res.status(400).json({ success: false, message: "Unit not found" });

    const currency = await AdminCurrency.findOne({
      where: { id: payload.currency_id, admin_id: adminId },
    });
    if (!currency)
      return res.status(400).json({ success: false, message: "Currency not found" });

    if (payload.file_id) {
      const file = await JobInputFiles.findOne({
        where: { id: payload.file_id, job_id: payload.job_id },
      });
      if (!file)
        return res.status(400).json({ success: false, message: "File not found for this job" });
    }

    const payable = await UnitBasedPayables.create(payload);
    const payableWithDetails = await UnitBasedPayables.findByPk(payable.id, getWithAssociations());

    return res.status(201).json({
      success: true,
      message: "Unit-based payable created successfully",
      data: payableWithDetails,
    });
  } catch (err) {
    console.error("createUnitBasedPayable err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// GET ALL
export const getAllUnitBasedPayables = async (req, res) => {
  const adminId = req.user.id;
  const { project_id, job_id, page = 1, limit = 25 } = req.query;

  if (!project_id)
    return res.status(400).json({ success: false, message: "project_id is required" });

  try {
    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    const whereClause = { project_id };
    if (job_id) whereClause.job_id = job_id;

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const payables = await UnitBasedPayables.findAndCountAll({
      where: whereClause,
      ...getWithAssociations(),
      order: [["id", "DESC"]],
      offset,
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      meta: {
        total: payables.count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      data: payables.rows,
    });
  } catch (err) {
    console.error("getAllUnitBasedPayables err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET BY ID
export const getUnitBasedPayableById = async (req, res) => {
  const adminId = req.user.id;
  const { payableId } = req.params;

  try {
    const payable = await UnitBasedPayables.findOne({
      where: { id: payableId },
      ...getWithAssociations(),
    });

    if (!payable)
      return res.status(404).json({ success: false, message: "Payable not found" });

    const project = await ProjectDetails.findOne({
      where: { id: payable.project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(403).json({ success: false, message: "Access denied" });

    return res.status(200).json({ success: true, data: payable });
  } catch (err) {
    console.error("getUnitBasedPayableById err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
export const updateUnitBasedPayable = async (req, res) => {
  const adminId = req.user.id;
  const { payableId } = req.params;
  const payload = pickAllowed(
    req.body,
    ALLOWED_FIELDS.filter((f) => f !== "project_id")
  );

  ["file_id", "note_for_vendor", "internal_note"].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = updateSchema.validate(payload);
  if (error)
    return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const existing = await UnitBasedPayables.findByPk(payableId);
    if (!existing)
      return res.status(404).json({ success: false, message: "Payable not found" });

    const project = await ProjectDetails.findOne({
      where: { id: existing.project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(403).json({ success: false, message: "Access denied" });

    const effectiveJobId = payload.job_id ?? existing.job_id;

    if (payload.job_id) {
      const job = await JobDetails.findOne({
        where: { id: payload.job_id, project_id: existing.project_id },
      });
      if (!job)
        return res.status(400).json({ success: false, message: "Job not found for this project" });
    }

    if (payload.unit_id) {
      const unit = await AdminUnits.findOne({
        where: { id: payload.unit_id, admin_id: adminId },
      });
      if (!unit)
        return res.status(400).json({ success: false, message: "Unit not found" });
    }

    if (payload.currency_id) {
      const currency = await AdminCurrency.findOne({
        where: { id: payload.currency_id, admin_id: adminId },
      });
      if (!currency)
        return res.status(400).json({ success: false, message: "Currency not found" });
    }

    if (payload.file_id) {
      const file = await JobInputFiles.findOne({
        where: { id: payload.file_id, job_id: effectiveJobId },
      });
      if (!file)
        return res.status(400).json({ success: false, message: "File not found for this job" });
    }

    await UnitBasedPayables.update(payload, { where: { id: payableId } });
    const updated = await UnitBasedPayables.findByPk(payableId, getWithAssociations());

    return res.status(200).json({
      success: true,
      message: "Payable updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("updateUnitBasedPayable err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// DELETE
export const deleteUnitBasedPayable = async (req, res) => {
  const adminId = req.user.id;
  const { payableId } = req.params;

  try {
    const payable = await UnitBasedPayables.findByPk(payableId);
    if (!payable)
      return res.status(404).json({ success: false, message: "Payable not found" });

    const project = await ProjectDetails.findOne({
      where: { id: payable.project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(403).json({ success: false, message: "Access denied" });

    await UnitBasedPayables.destroy({ where: { id: payableId } });

    return res.status(200).json({ success: true, message: "Payable deleted successfully" });
  } catch (err) {
    console.error("deleteUnitBasedPayable err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};