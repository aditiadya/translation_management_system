import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import Joi from "joi";

const {
  JobDetails,
  JobStatusHistory,
  ProjectDetails,
  ClientDetails,
  ClientPrimaryUserDetails,
  VendorDetails,
  VendorPrimaryUserDetails,
  VendorContactPersons,
  AdminService,
  AdminLanguagePair,
  AdminSpecialization,
  ManagerDetails,
  Language,
} = db;

const ALLOWED_FIELDS = [
  "project_id",
  "vendor_id",
  "vendor_contact_person_id",
  "name",
  "service_id",
  "language_pair_id",
  "deadline_at",
  "auto_start_on_vendor_acceptance",
  "instructions",
  "internal_note",
  "pdf_template_id",
  "checklist_id",
];

const createJobSchema = Joi.object({
  project_id: Joi.number().integer().required(),
  vendor_id: Joi.number().integer().required(),
  vendor_contact_person_id: Joi.number().integer().optional().allow(null),
  name: Joi.string().required(),
  service_id: Joi.number().integer().required(),
  language_pair_id: Joi.number().integer().optional().allow(null),
  deadline_at: Joi.date().required(),
  auto_start_on_vendor_acceptance: Joi.boolean().optional().default(false),
  instructions: Joi.string().optional().allow(null, ""),
  internal_note: Joi.string().optional().allow(null, ""),
  pdf_template_id: Joi.number().integer().required(),
  checklist_id: Joi.number().integer().optional().allow(null),
});

const updateJobSchema = Joi.object({
  project_id: Joi.number().integer().optional(),
  vendor_id: Joi.number().integer().optional(),
  vendor_contact_person_id: Joi.number().integer().optional().allow(null),
  name: Joi.string().optional(),
  service_id: Joi.number().integer().optional(),
  language_pair_id: Joi.number().integer().optional().allow(null),
  deadline_at: Joi.date().optional(),
  auto_start_on_vendor_acceptance: Joi.boolean().optional(),
  instructions: Joi.string().optional().allow(null, ""),
  internal_note: Joi.string().optional().allow(null, ""),
  pdf_template_id: Joi.number().integer().optional(),
  checklist_id: Joi.number().integer().optional().allow(null),
});

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Unique constraint error" },
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

// Helper function to get job with all associations
const getJobWithAssociations = (transaction = null) => {
  return {
    include: [
      {
        model: ProjectDetails,
        as: "project",
        attributes: ["id", "project_name", "client_id"],
        include: [
            {
            model: AdminSpecialization,
            as: "specialization",
            attributes: ["id", "name", "active_flag"],
          },
          {
            model: ClientDetails,
            as: "client",
            attributes: ["id", "company_name", "type"],
            include: [
              {
                model: ClientPrimaryUserDetails,
                as: "primary_user",
                attributes: ["id", "first_name", "last_name"],
              },
            ],
          },
          {
            model: ManagerDetails,
            as: "primaryManager",
            attributes: ["id", "first_name", "last_name"],
          },
          {
            model: ManagerDetails,
            as: "secondaryManager",
            attributes: ["id", "first_name", "last_name"],
          },
          
        ],
      },
      {
        model: VendorDetails,
        as: "vendor",
        attributes: ["id", "company_name", "type"],
        include: [
          {
            model: VendorPrimaryUserDetails,
            as: "primary_users",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      },
      {
        model: VendorContactPersons,
        as: "vendorContactPerson",
        attributes: ["id", "first_name", "last_name", "email", "phone"],
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
            attributes: ["id", "name"],
          },
          {
            model: Language,
            as: "targetLanguage",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
    ...(transaction && { transaction }),
  };
};

// Create Job
export const createJob = async (req, res) => {
  const adminId = req.user.id;

  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  // Handle empty strings
  [
    "vendor_contact_person_id",
    "language_pair_id",
    "instructions",
    "internal_note",
    "checklist_id",
  ].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = createJobSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    // Validate project belongs to admin
    const project = await ProjectDetails.findOne({
      where: { id: payload.project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(400).json({
        success: false,
        message: "Project does not belong to this admin",
      });

    // Validate vendor belongs to admin
    const vendor = await VendorDetails.findOne({
      where: { id: payload.vendor_id, admin_id: adminId },
    });
    if (!vendor)
      return res.status(400).json({
        success: false,
        message: "Vendor does not belong to this admin",
      });

    // Validate vendor contact person
    if (payload.vendor_contact_person_id) {
      const contactPerson = await VendorContactPersons.findOne({
        where: {
          id: payload.vendor_contact_person_id,
          vendor_id: payload.vendor_id,
        },
      });
      if (!contactPerson) {
        return res.status(400).json({
          success: false,
          message: "Vendor contact person not found for this vendor",
        });
      }
    }

    // Validate service
    const service = await AdminService.findOne({
      where: { id: payload.service_id, admin_id: adminId },
    });
    if (!service)
      return res
        .status(400)
        .json({ success: false, message: "Service invalid" });

    // Validate language pair if provided
    if (payload.language_pair_id) {
      const lang = await AdminLanguagePair.findOne({
        where: { id: payload.language_pair_id, admin_id: adminId },
      });
      if (!lang)
        return res
          .status(400)
          .json({ success: false, message: "Language pair invalid" });
    }

    // Create job with status history in transaction
    const job = await JobDetails.sequelize.transaction(async (t) => {
      const dataToCreate = {
        ...payload,
        admin_id: adminId,
        status: "Draft", // Default status
      };

      const created = await JobDetails.create(dataToCreate, {
        transaction: t,
      });

      // Create initial status history
      await JobStatusHistory.create(
        {
          job_id: created.id,
          old_status: null,
          new_status: "Draft",
          changed_at: new Date(),
          changed_by: "admin",
          comment: "Job created",
          auto_transitioned: false,
        },
        { transaction: t }
      );

      return created;
    });

    // Fetch the created job with all associations
    const jobWithDetails = await JobDetails.findByPk(
      job.id,
      getJobWithAssociations()
    );

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: jobWithDetails,
    });
  } catch (err) {
    console.error("createJob err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Get all jobs under a project
export const getJobsByProject = async (req, res) => {
  const adminId = req.user.id;
  const projectId = req.params.projectId;
  const {
    page = 1,
    limit = 25,
    status,
    vendor_id,
    service_id,
  } = req.query;

  try {
    // Verify project belongs to admin
    const project = await ProjectDetails.findOne({
      where: { id: projectId, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const where = { project_id: projectId, admin_id: adminId };
    const Op = db.Sequelize.Op;

    if (status) where.status = status;
    if (vendor_id) where.vendor_id = vendor_id;
    if (service_id) where.service_id = service_id;

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const jobs = await JobDetails.findAndCountAll({
      where,
      ...getJobWithAssociations(),
      order: [["id", "DESC"]],
      offset,
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      meta: {
        total: jobs.count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      data: jobs.rows,
    });
  } catch (err) {
    console.error("getJobsByProject err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all jobs (optional - for admin to see all jobs)
export const getAllJobs = async (req, res) => {
  const adminId = req.user.id;
  const {
    page = 1,
    limit = 25,
    status,
    project_id,
    vendor_id,
    service_id,
  } = req.query;

  const where = { admin_id: adminId };
  const Op = db.Sequelize.Op;

  if (status) where.status = status;
  if (project_id) where.project_id = project_id;
  if (vendor_id) where.vendor_id = vendor_id;
  if (service_id) where.service_id = service_id;

  try {
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const jobs = await JobDetails.findAndCountAll({
      where,
      ...getJobWithAssociations(),
      order: [["id", "DESC"]],
      offset,
      limit: parseInt(limit, 10),
    });

    return res.status(200).json({
      success: true,
      meta: {
        total: jobs.count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      data: jobs.rows,
    });
  } catch (err) {
    console.error("getAllJobs err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get job by id
export const getJobById = async (req, res) => {
  const adminId = req.user.id;
  const jobId = req.params.id;

  try {
    const job = await JobDetails.findOne({
      where: { id: jobId, admin_id: adminId },
      ...getJobWithAssociations(),
    });

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    return res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error("getJobById err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Update Job
export const updateJob = async (req, res) => {
  const adminId = req.user.id;
  const jobId = req.params.id;
  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  // Handle empty strings
  [
    "vendor_contact_person_id",
    "language_pair_id",
    "instructions",
    "internal_note",
    "checklist_id",
  ].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = updateJobSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const updated = await JobDetails.sequelize.transaction(async (t) => {
      const existing = await JobDetails.findOne({
        where: { id: jobId, admin_id: adminId },
        transaction: t,
      });
      if (!existing) throw { name: "NotFound", message: "Job not found" };

      // Validate project if changed
      if (payload.project_id && payload.project_id !== existing.project_id) {
        const newProject = await ProjectDetails.findOne({
          where: { id: payload.project_id, admin_id: adminId },
          transaction: t,
        });
        if (!newProject)
          throw {
            name: "BadRequest",
            message: "New project does not belong to this admin",
          };
      }

      // Validate vendor if changed
      if (payload.vendor_id && payload.vendor_id !== existing.vendor_id) {
        const newVendor = await VendorDetails.findOne({
          where: { id: payload.vendor_id, admin_id: adminId },
          transaction: t,
        });
        if (!newVendor)
          throw {
            name: "BadRequest",
            message: "New vendor does not belong to this admin",
          };
      }

      // Validate vendor contact person
      if (payload.vendor_contact_person_id) {
        const targetVendorId = payload.vendor_id || existing.vendor_id;
        const cp = await VendorContactPersons.findOne({
          where: {
            id: payload.vendor_contact_person_id,
            vendor_id: targetVendorId,
          },
          transaction: t,
        });
        if (!cp)
          throw {
            name: "BadRequest",
            message: "Contact person invalid for the selected vendor",
          };
      }

      // Validate service if changed
      if (payload.service_id) {
        const service = await AdminService.findOne({
          where: { id: payload.service_id, admin_id: adminId },
          transaction: t,
        });
        if (!service) throw { name: "BadRequest", message: "Service invalid" };
      }

      // Validate language pair if provided
      if (
        payload.language_pair_id !== undefined &&
        payload.language_pair_id !== null
      ) {
        const lang = await AdminLanguagePair.findOne({
          where: { id: payload.language_pair_id, admin_id: adminId },
          transaction: t,
        });
        if (!lang)
          throw { name: "BadRequest", message: "Language pair invalid" };
      }

      // Update job details
      await JobDetails.update(payload, {
        where: { id: jobId, admin_id: adminId },
        transaction: t,
      });

      // Fetch updated job with all associations
      const updatedJob = await JobDetails.findOne({
        where: { id: jobId, admin_id: adminId },
        ...getJobWithAssociations(t),
      });

      return updatedJob;
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateJob err:", err);
    if (err?.name === "NotFound")
      return res
        .status(404)
        .json({ success: false, message: err.message || "Job not found" });

    if (err?.name === "BadRequest")
      return res
        .status(400)
        .json({ success: false, message: err.message || "Invalid request" });

    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  const adminId = req.user.id;
  const jobId = req.params.id;

  try {
    const job = await JobDetails.findOne({
      where: { id: jobId, admin_id: adminId },
    });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    await JobDetails.sequelize.transaction(async (t) => {
      // Delete status history first
      await JobStatusHistory.destroy({
        where: { job_id: jobId },
        transaction: t,
      });

      // Delete the job
      await JobDetails.destroy({
        where: { id: jobId },
        transaction: t,
      });
    });

    return res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    console.error("deleteJob err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Get job status history
export const getJobStatusHistory = async (req, res) => {
  const adminId = req.user.id;
  const jobId = req.params.id;

  try {
    // Verify job belongs to admin
    const job = await JobDetails.findOne({
      where: { id: jobId, admin_id: adminId },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const statusHistory = await JobStatusHistory.findAll({
      where: { job_id: jobId },
      order: [["changed_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: statusHistory,
    });
  } catch (err) {
    console.error("getJobStatusHistory err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};