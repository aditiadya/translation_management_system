import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import Joi from "joi";

const {
  ProjectDetails,
  ProjectStatusHistory,
  AdminAuth,
  ClientDetails,
  ClientPrimaryUserDetails,
  ClientContactPersons,
  AdminService,
  AdminLanguagePair,
  AdminSpecialization,
  ManagerDetails,
  ProjectLanguagePair,
  Language,
} = db;

const ALLOWED_FIELDS = [
  "client_id",
  "client_contact_person_id",
  "project_name",
  "service_id",
  "language_pair_ids", // Changed from language_pair_id
  "specialization_id",
  "start_at",
  "deadline_at",
  "instructions",
  "internal_note",
  "primary_manager_id",
  "secondary_manager_id",
  "status",
];

const createProjectSchema = Joi.object({
  client_id: Joi.number().integer().required(),
  client_contact_person_id: Joi.number().integer().optional().allow(null),
  project_name: Joi.string().required(),
  service_id: Joi.number().integer().optional().allow(null),
  language_pair_ids: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one language pair is required",
    }),
  specialization_id: Joi.number().integer().optional().allow(null),
  start_at: Joi.date().required(),
  deadline_at: Joi.date()
    .greater(Joi.ref("start_at"))
    .required()
    .messages({
      "date.greater": "Deadline must be later than start time.",
    }),
  instructions: Joi.string().optional().allow(null, ""),
  internal_note: Joi.string().optional().allow(null, ""),
  primary_manager_id: Joi.number().integer().required(),
  secondary_manager_id: Joi.number().integer().optional().allow(null),
  status: Joi.string()
    .valid(
      "Offered by Client",
      "Offer Accepted",
      "Offer Rejected",
      "Draft",
      "In Progress",
      "Hold",
      "Submitted",
      "Submission Accepted",
      "Submission Rejected",
      "Cancelled"
    )
    .optional(),
});

const updateProjectSchema = Joi.object({
  client_id: Joi.number().integer().optional(),
  client_contact_person_id: Joi.number().integer().optional().allow(null),
  project_name: Joi.string().optional(),
  service_id: Joi.number().integer().optional().allow(null),
  language_pair_ids: Joi.array()
    .items(Joi.number().integer())
    .min(1)
    .optional(),
  specialization_id: Joi.number().integer().optional().allow(null),
  start_at: Joi.date().optional(),
  deadline_at: Joi.date()
    .greater(Joi.ref("start_at"))
    .optional()
    .messages({
      "date.greater": "Deadline must be later than start time.",
    }),
  instructions: Joi.string().optional().allow(null, ""),
  internal_note: Joi.string().optional().allow(null, ""),
  primary_manager_id: Joi.number().integer().optional(),
  secondary_manager_id: Joi.number().integer().optional().allow(null),
  status: Joi.string()
    .valid(
      "Offered by Client",
      "Offer Accepted",
      "Offer Rejected",
      "Draft",
      "In Progress",
      "Hold",
      "Submitted",
      "Submission Accepted",
      "Submission Rejected",
      "Cancelled"
    )
    .optional(),
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

// Helper function to get project with all associations
const getProjectWithAssociations = (transaction = null) => {
  return {
    include: [
      {
        model: ClientDetails,
        as: "client",
        attributes: ["id", "company_name"],
        include: [
          {
            model: ClientPrimaryUserDetails,
            as: "primary_user",
            attributes: ["id", "first_name", "last_name"],
          },
          {
            model: ClientContactPersons,
            as: "contactPersons",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      },
      {
        model: ClientContactPersons,
        as: "contactPerson",
        attributes: ["id", "first_name", "last_name"],
      },
      {
        model: AdminService,
        as: "service",
        attributes: ["id", "name"],
      },
      {
        model: AdminLanguagePair,
        as: "languagePairs",
        through: { attributes: [] },
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
      {
        model: AdminSpecialization,
        as: "specialization",
        attributes: ["id", "name"],
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
    ...(transaction && { transaction }),
  };
};

// Create Project
export const createProject = async (req, res) => {
  const adminId = req.user.id;

  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  // Handle empty strings
  [
    "client_contact_person_id",
    "service_id",
    "specialization_id",
    "secondary_manager_id",
    "instructions",
    "internal_note",
  ].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = createProjectSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    // Validate client
    const client = await ClientDetails.findOne({
      where: { id: payload.client_id, admin_id: adminId },
    });
    if (!client)
      return res.status(400).json({
        success: false,
        message: "Client does not belong to this admin",
      });

    // Validate contact person
    if (payload.client_contact_person_id) {
      const contactPerson = await ClientContactPersons.findOne({
        where: {
          id: payload.client_contact_person_id,
          client_id: payload.client_id,
        },
      });

      if (!contactPerson) {
        return res.status(400).json({
          success: false,
          message: "Client contact person not found for this client",
        });
      }
    } else {
      payload.client_contact_person_id = null;
    }

    // Validate primary manager
    const primaryManager = await ManagerDetails.findOne({
      where: { id: payload.primary_manager_id, admin_id: adminId },
    });
    if (!primaryManager)
      return res.status(400).json({
        success: false,
        message: "Primary manager not found or not owned by this admin",
      });

    // Validate secondary manager
    if (payload.secondary_manager_id) {
      const secondaryManager = await ManagerDetails.findOne({
        where: { id: payload.secondary_manager_id, admin_id: adminId },
      });
      if (!secondaryManager)
        return res.status(400).json({
          success: false,
          message: "Secondary manager not found or not owned by this admin",
        });
    }

    // Validate service
    if (payload.service_id) {
      const service = await AdminService.findOne({
        where: { id: payload.service_id, admin_id: adminId },
      });
      if (!service)
        return res
          .status(400)
          .json({ success: false, message: "Service invalid" });
    }

    // Validate all language pairs
    const languagePairIds = payload.language_pair_ids;
    const validLanguagePairs = await AdminLanguagePair.findAll({
      where: {
        id: languagePairIds,
        admin_id: adminId,
      },
    });

    if (validLanguagePairs.length !== languagePairIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more language pairs are invalid",
      });
    }

    // Validate specialization
    if (payload.specialization_id) {
      const spec = await AdminSpecialization.findOne({
        where: { id: payload.specialization_id, admin_id: adminId },
      });
      if (!spec)
        return res
          .status(400)
          .json({ success: false, message: "Specialization invalid" });
    }

    // Create project with language pairs in transaction
    const project = await ProjectDetails.sequelize.transaction(async (t) => {
      // Remove language_pair_ids from payload before creating project
      const { language_pair_ids, ...projectData } = payload;

      const dataToCreate = {
        ...projectData,
        admin_id: adminId,
      };

      const created = await ProjectDetails.create(dataToCreate, {
        transaction: t,
      });

      // Create project language pair associations
      const languagePairAssociations = language_pair_ids.map((lpId) => ({
        project_id: created.id,
        language_pair_id: lpId,
      }));

      await ProjectLanguagePair.bulkCreate(languagePairAssociations, {
        transaction: t,
      });

      // Create status history
      await ProjectStatusHistory.create(
        {
          project_id: created.id,
          old_status: null,
          new_status: created.status,
          changed_at: new Date(),
          comment: payload.status_comment || null,
        },
        { transaction: t }
      );

      return created;
    });

    // Fetch the created project with all associations
    const projectWithDetails = await ProjectDetails.findByPk(
      project.id,
      getProjectWithAssociations()
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: projectWithDetails,
    });
  } catch (err) {
    console.error("createProject err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Update Project
export const updateProject = async (req, res) => {
  const adminId = req.user.id;
  const projectId = req.params.id;
  const payload = pickAllowed(req.body, ALLOWED_FIELDS);

  // Handle empty strings
  [
    "service_id",
    "specialization_id",
    "secondary_manager_id",
    "instructions",
    "internal_note",
  ].forEach((k) => {
    if (payload[k] === "") payload[k] = null;
  });

  const { error } = updateProjectSchema.validate(payload);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const updated = await ProjectDetails.sequelize.transaction(async (t) => {
      const existing = await ProjectDetails.findOne({
        where: { id: projectId, admin_id: adminId },
        transaction: t,
      });
      if (!existing) throw { name: "NotFound", message: "Project not found" };

      const isStatusChanged =
        payload.status && payload.status !== existing.status;

      // Validate new client if changed
      if (payload.client_id && payload.client_id !== existing.client_id) {
        const newClient = await ClientDetails.findOne({
          where: { id: payload.client_id, admin_id: adminId },
          transaction: t,
        });
        if (!newClient)
          throw {
            name: "BadRequest",
            message: "New client does not belong to this admin",
          };
      }

      // Validate contact person
      if (payload.client_contact_person_id) {
        const targetClientId = payload.client_id || existing.client_id;
        const cp = await ClientContactPersons.findOne({
          where: {
            id: payload.client_contact_person_id,
            client_id: targetClientId,
          },
          transaction: t,
        });
        if (!cp)
          throw {
            name: "BadRequest",
            message: "Contact person invalid for the selected client",
          };
      }

      // Validate primary manager
      if (payload.primary_manager_id) {
        const primary = await ManagerDetails.findOne({
          where: { id: payload.primary_manager_id, admin_id: adminId },
          transaction: t,
        });
        if (!primary)
          throw { name: "BadRequest", message: "Primary manager invalid" };
      }

      // Validate secondary manager
      if (
        payload.secondary_manager_id !== undefined &&
        payload.secondary_manager_id !== null
      ) {
        const secondary = await ManagerDetails.findOne({
          where: { id: payload.secondary_manager_id, admin_id: adminId },
          transaction: t,
        });
        if (!secondary)
          throw { name: "BadRequest", message: "Secondary manager invalid" };
      }

      // Validate service
      if (payload.service_id !== undefined && payload.service_id !== null) {
        const service = await AdminService.findOne({
          where: { id: payload.service_id, admin_id: adminId },
          transaction: t,
        });
        if (!service) throw { name: "BadRequest", message: "Service invalid" };
      }

      // Validate language pairs if provided
      if (payload.language_pair_ids && payload.language_pair_ids.length > 0) {
        const validLanguagePairs = await AdminLanguagePair.findAll({
          where: {
            id: payload.language_pair_ids,
            admin_id: adminId,
          },
          transaction: t,
        });

        if (validLanguagePairs.length !== payload.language_pair_ids.length) {
          throw {
            name: "BadRequest",
            message: "One or more language pairs are invalid",
          };
        }
      }

      // Validate specialization
      if (
        payload.specialization_id !== undefined &&
        payload.specialization_id !== null
      ) {
        const spec = await AdminSpecialization.findOne({
          where: { id: payload.specialization_id, admin_id: adminId },
          transaction: t,
        });
        if (!spec)
          throw { name: "BadRequest", message: "Specialization invalid" };
      }

      // Extract language_pair_ids before updating project
      const { language_pair_ids, ...projectData } = payload;

      // Update project details
      await ProjectDetails.update(projectData, {
        where: { id: projectId, admin_id: adminId },
        transaction: t,
      });

      // Update language pairs if provided
      if (language_pair_ids && language_pair_ids.length > 0) {
        // Remove existing associations
        await ProjectLanguagePair.destroy({
          where: { project_id: projectId },
          transaction: t,
        });

        // Create new associations
        const languagePairAssociations = language_pair_ids.map((lpId) => ({
          project_id: projectId,
          language_pair_id: lpId,
        }));

        await ProjectLanguagePair.bulkCreate(languagePairAssociations, {
          transaction: t,
        });
      }

      // Log status change if status was updated
      if (isStatusChanged) {
        await ProjectStatusHistory.create(
          {
            project_id: existing.id,
            old_status: existing.status,
            new_status: payload.status,
            changed_at: new Date(),
            comment: payload.status_comment || null,
          },
          { transaction: t }
        );
      }

      // Fetch updated project with all associations
      const updatedProject = await ProjectDetails.findOne({
        where: { id: projectId, admin_id: adminId },
        ...getProjectWithAssociations(t),
      });

      return updatedProject;
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("updateProject err:", err);
    if (err?.name === "NotFound")
      return res
        .status(404)
        .json({ success: false, message: err.message || "Project not found" });

    if (err?.name === "BadRequest")
      return res
        .status(400)
        .json({ success: false, message: err.message || "Invalid request" });

    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Get project by id
export const getProjectById = async (req, res) => {
  const adminId = req.user.id;
  const projectId = req.params.id;

  try {
    const project = await ProjectDetails.findOne({
      where: { id: projectId, admin_id: adminId },
      ...getProjectWithAssociations(),
    });

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error("getProjectById err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  const adminId = req.user.id;
  const {
    page = 1,
    limit = 25,
    status,
    client_id,
    manager_id,
    start_from,
    start_to,
    language_pair_id, // New filter for language pair
  } = req.query;

  const where = { admin_id: adminId };
  const Op = db.Sequelize.Op;

  if (status) where.status = status;
  if (client_id) where.client_id = client_id;

  if (manager_id) {
    where[Op.or] = [
      { primary_manager_id: manager_id },
      { secondary_manager_id: manager_id },
    ];
  }

  if (start_from || start_to) {
    where.start_at = {};
    if (start_from) where.start_at[Op.gte] = new Date(start_from);
    if (start_to) where.start_at[Op.lte] = new Date(start_to);
  }

  try {
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    // Build include array with optional language pair filter
    const includeArray = [
      {
        model: ClientDetails,
        as: "client",
        attributes: ["id", "company_name"],
        include: [
          {
            model: ClientPrimaryUserDetails,
            as: "primary_user",
            attributes: ["id", "first_name", "last_name"],
          },
          {
            model: ClientContactPersons,
            as: "contactPersons",
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      },
      {
        model: ClientContactPersons,
        as: "contactPerson",
        attributes: ["id", "first_name", "last_name"],
      },
      {
        model: AdminService,
        as: "service",
        attributes: ["id", "name"],
      },
      {
        model: AdminLanguagePair,
        as: "languagePairs",
        through: { attributes: [] },
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
        // Add where clause if filtering by language pair
        ...(language_pair_id && {
          where: { id: language_pair_id },
          required: true,
        }),
      },
      {
        model: AdminSpecialization,
        as: "specialization",
        attributes: ["id", "name"],
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
    ];

    const projects = await ProjectDetails.findAndCountAll({
      where,
      include: includeArray,
      order: [["id", "DESC"]],
      offset,
      limit: parseInt(limit, 10),
      distinct: true, // Important for accurate count with joins
    });

    return res.status(200).json({
      success: true,
      meta: {
        total: projects.count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      data: projects.rows,
    });
  } catch (err) {
    console.error("getAllProjects err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  const adminId = req.user.id;
  const projectId = req.params.id;

  try {
    const project = await ProjectDetails.findOne({
      where: { id: projectId, admin_id: adminId },
    });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    await ProjectDetails.sequelize.transaction(async (t) => {
      // Delete language pair associations first
      await ProjectLanguagePair.destroy({
        where: { project_id: projectId },
        transaction: t,
      });

      // Delete status history
      await ProjectStatusHistory.destroy({
        where: { project_id: projectId },
        transaction: t,
      });

      // Delete the project
      await ProjectDetails.destroy({
        where: { id: projectId },
        transaction: t,
      });
    });

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("deleteProject err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code).json(errResp.body);
  }
};