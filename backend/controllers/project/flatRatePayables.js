import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import Joi from "joi";

const {
  FlatRatePayables,
  ProjectDetails,
  JobDetails,
  AdminCurrency,
  Currency,
  JobInputFiles,
} = db;

const ALLOWED_FIELDS = [
  "project_id",
  "job_id",
  "currency_id",
  "subtotal",
  "file_id",
  "note_for_vendor",
  "internal_note",
];

const createSchema = Joi.object({
  project_id: Joi.number().integer().required(),
  job_id: Joi.number().integer().required(),
  currency_id: Joi.number().integer().required(),
  subtotal: Joi.number().positive().required(),
  file_id: Joi.number().integer().allow(null).optional(),
  note_for_vendor: Joi.string().allow("", null).optional(),
  internal_note: Joi.string().allow("", null).optional(),
});

const updateSchema = Joi.object({
  job_id: Joi.number().integer().optional(),
  currency_id: Joi.number().integer().optional(),
  subtotal: Joi.number().positive().optional(),
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
export const createFlatRatePayable = async (req, res) => {
  const adminId = req.user.id;
  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  ["file_id", "note_for_vendor", "internal_note"].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

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

    // Validate job belongs to the project
    const job = await JobDetails.findOne({
      where: { id: payload.job_id, project_id: payload.project_id },
    });
    if (!job)
      return res
        .status(400)
        .json({ success: false, message: "Job not found for this project" });

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
      const file = await JobInputFiles.findOne({
        where: { id: payload.file_id, job_id: payload.job_id },
      });
      if (!file)
        return res
          .status(400)
          .json({ success: false, message: "File not found for this job" });
    }

    const payable = await FlatRatePayables.create(payload);

    const payableWithDetails = await FlatRatePayables.findByPk(
      payable.id,
      getWithAssociations()
    );

    return res.status(201).json({
      success: true,
      message: "Flat rate payable created successfully",
      data: payableWithDetails,
    });
  } catch (err) {
    console.error("createFlatRatePayable err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// GET ALL (by project)
export const getAllFlatRatePayables = async (req, res) => {
  const adminId = req.user.id;
  const { project_id, job_id, page = 1, limit = 25 } = req.query;

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

    const whereClause = { project_id };
    // Optionally filter by job
    if (job_id) whereClause.job_id = job_id;

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const payables = await FlatRatePayables.findAndCountAll({
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
    console.error("getAllFlatRatePayables err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET BY ID
export const getFlatRatePayableById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const payable = await FlatRatePayables.findOne({
      where: { id },
      ...getWithAssociations(),
    });

    if (!payable)
      return res
        .status(404)
        .json({ success: false, message: "Payable not found" });

    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: payable.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });

    return res.status(200).json({ success: true, data: payable });
  } catch (err) {
    console.error("getFlatRatePayableById err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE
export const updateFlatRatePayable = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const payload = pickAllowed(
    req.body,
    ALLOWED_FIELDS.filter((f) => f !== "project_id")
  );

  ["file_id", "note_for_vendor", "internal_note"].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = updateSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const existing = await FlatRatePayables.findByPk(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Payable not found" });

    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: existing.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });

    // Determine which job_id to validate file against
    const effectiveJobId = payload.job_id ?? existing.job_id;

    // Validate new job if provided
    if (payload.job_id) {
      const job = await JobDetails.findOne({
        where: { id: payload.job_id, project_id: existing.project_id },
      });
      if (!job)
        return res
          .status(400)
          .json({ success: false, message: "Job not found for this project" });
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
      const file = await JobInputFiles.findOne({
        where: { id: payload.file_id, job_id: effectiveJobId },
      });
      if (!file)
        return res
          .status(400)
          .json({ success: false, message: "File not found for this job" });
    }

    await FlatRatePayables.update(payload, { where: { id } });

    const updated = await FlatRatePayables.findByPk(id, getWithAssociations());

    return res.status(200).json({
      success: true,
      message: "Payable updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("updateFlatRatePayable err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// DELETE
export const deleteFlatRatePayable = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const payable = await FlatRatePayables.findByPk(id);
    if (!payable)
      return res
        .status(404)
        .json({ success: false, message: "Payable not found" });

    // Verify project ownership
    const project = await ProjectDetails.findOne({
      where: { id: payable.project_id, admin_id: adminId },
    });
    if (!project)
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });

    await FlatRatePayables.destroy({ where: { id } });

    return res
      .status(200)
      .json({ success: true, message: "Payable deleted successfully" });
  } catch (err) {
    console.error("deleteFlatRatePayable err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};