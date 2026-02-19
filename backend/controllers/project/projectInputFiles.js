import fs from "fs";
import path from "path";
import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { ProjectInputFiles, ProjectDetails, AdminAuth, AdminDetails, ClientDetails } = db;

const PROJECT_INPUT_ALLOWED_FIELDS = [
  "project_id",
  "file_name",
  "category",
  "note",
  "input_for_jobs",
];

const toProjectFileError = (error) => {
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

// Create
export const createProjectInputFile = async (req, res) => {
  const adminId = req.user.id;
  const file = req.file;;

  try {
    const data = pickAllowed(req.body, PROJECT_INPUT_ALLOWED_FIELDS);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const project = await ProjectDetails.findOne({
      where: { id: data.project_id, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or not associated with this admin",
      });
    }

    const relativePath = path.posix.join(
      "uploads",
      "project_input_files",
      file.filename
    );

    const newFile = await ProjectInputFiles.create({
      project_id: data.project_id,
      original_file_name: file.originalname,
      file_name: file.filename,
      file_path: relativePath,
      file_path: relativePath,
      file_size: file.size,
      file_type: file.mimetype,
      uploaded_by: adminId,
      category: data.category || null,
      note: data.note?.trim() || null,
      input_for_jobs: data.input_for_jobs || null,
    });

    return res.status(201).json({
      success: true,
      message: "Input file uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    console.error("CREATE PROJECT INPUT FILE ERROR:", error);
    const err = toProjectFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all project files
export const getAllProjectInputFiles = async (req, res) => {
  const adminId = req.user.id;
  const { project_id } = req.query;

  try {
    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: "project_id is required",
      });
    }

    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or not associated with this admin",
      });
    }

    const files = await ProjectInputFiles.findAll({
      where: { project_id },
      include: [
        {
          model: db.AdminAuth,
          as: "uploader",
          attributes: ["id", "email"],
          include: [
            {
              model: db.AdminDetails,
              as: "details",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
      ],
      order: [["uploaded_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    console.error("GET ALL PROJECT INPUT FILES ERROR:", error);
    const err = toProjectFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get single file
export const getProjectInputFileById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const file = await ProjectInputFiles.findByPk(id, {
      include: [{ model: ProjectDetails, as: "project" }],
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.project.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This file does not belong to your projects.",
      });
    }

    return res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error("GET PROJECT INPUT FILE BY ID ERROR:", error);
    const err = toProjectFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update file metadata or replace file
export const updateProjectInputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const file = req.files?.file?.[0];

  console.log("BODY =>", req.body);
  console.log("FILES =>", req.files);

  const data = pickAllowed(req.body || {}, [
  "file_name",
  "category",
  "note",
  "input_for_jobs",
]);

  try {
    const document = await ProjectInputFiles.findByPk(id, {
      include: [{ model: ProjectDetails, as: "project" }],
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (document.project.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This file does not belong to your projects.",
      });
    }

    if (file) {
  if (document.file_path) {
    const oldPath = path.resolve(document.file_path);
    try {
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log("Old file deleted:", oldPath);
      }
    } catch (e) {
      console.warn("Failed to delete old file:", oldPath, e.message);
    }
  }

  const newPath = path.posix.join(
    "uploads",
    "project_input_files",
    file.filename
  );

  document.original_file_name = file.originalname;
  document.file_name = file.filename;
  document.file_size = file.size;
  document.file_type = file.mimetype;
  document.file_path = newPath;
}

    if (data.category !== undefined) document.category = data.category;
    if (data.note !== undefined) document.note = data.note?.trim() || null;
    if (data.input_for_jobs !== undefined)
      document.input_for_jobs = data.input_for_jobs;

    await document.save();

    return res.status(200).json({
      success: true,
      message: file
        ? "File and details updated successfully"
        : "File details updated successfully",
      data: document,
    });
  } catch (error) {
    console.error("UPDATE PROJECT INPUT FILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating file",
    });
  }
};

// Delete file
export const deleteProjectInputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const file = await ProjectInputFiles.findByPk(id, {
      include: [{ model: ProjectDetails, as: "project" }],
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.project.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This file does not belong to your projects.",
      });
    }

    // Find and delete all linked JobInputFiles entries
    const linkedJobFiles = await db.JobInputFiles.findAll({
      where: {
        project_input_file_id: id,
        is_linked: true,
      },
    });

    // Destroy all linked job input file records (no physical file to delete since they're linked)
    if (linkedJobFiles.length > 0) {
      await db.JobInputFiles.destroy({
        where: {
          project_input_file_id: id,
          is_linked: true,
        },
      });
    }

    // Now delete the actual physical file
    const filePath = path.resolve(file.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete the project input file record
    await file.destroy();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT INPUT FILE ERROR:", error);
    const err = toProjectFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all input files for a specific client (across all their projects)
export const getClientInputFiles = async (req, res) => {
  const adminId = req.user.id;
  const { id: clientId } = req.params;

  try {
    // Verify client ownership
    const { ClientDetails } = db;
    
    const client = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
      attributes: ["id", "company_name"],
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or access denied",
      });
    }

    // Get all projects for this client
    const projects = await ProjectDetails.findAll({
      where: { 
        client_id: clientId,
        admin_id: adminId 
      },
      attributes: ["id", "project_name"],
    });

    const projectIds = projects.map(p => p.id);

    if (projectIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No projects found for this client",
      });
    }

    // Get all input files for these projects
    const files = await ProjectInputFiles.findAll({
      where: { 
        project_id: projectIds 
      },
      include: [
        {
          model: ProjectDetails,
          as: "project",
          attributes: ["id", "project_name"],
        }
      ],
      attributes: [
        "id",
        "project_id",
        "original_file_name",
        "file_name",
        "file_code",
        "category",
        "file_size",
        // "file_type",  REMOVE THIS LINE
        "uploaded_at",
      ],
      order: [["uploaded_at", "DESC"]],
    });

    return res.json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    console.error("GET CLIENT INPUT FILES ERROR:", error);
    const err = toProjectFileError(error);
    return res.status(err.code).json(err.body);
  }
};
