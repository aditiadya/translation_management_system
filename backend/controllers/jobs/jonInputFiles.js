import fs from "fs";
import path from "path";
import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import archiver from "archiver"; 

const { JobInputFiles, JobDetails, ProjectInputFiles, ProjectDetails, AdminDetails } = db;

const ALLOWED_FIELDS = ["job_id", "category", "output_from_job"];

const toFileError = (error) => {
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

// Upload file directly for job
export const createJobInputFile = async (req, res) => {
  const adminId = req.user.id;
  const file = req.file;

  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Verify job belongs to admin
    const job = await JobDetails.findOne({
      where: { id: data.job_id, admin_id: adminId },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not associated with this admin",
      });
    }

    const relativePath = path.posix.join(
      "uploads",
      "job_input_files",
      file.filename
    );

    const newFile = await JobInputFiles.create({
      project_id: job.project_id,
      job_id: data.job_id,
      original_file_name: file.originalname,
      file_name: file.filename,
      file_path: relativePath,
      file_size: file.size,
      file_type: file.mimetype,
      uploaded_by: adminId,
      category: data.category || null,
      output_from_job: data.output_from_job || null,
      is_linked: false,
    });

    return res.status(201).json({
      success: true,
      message: "Job input file uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    console.error("CREATE JOB INPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Link project input file to job
export const linkProjectFileToJob = async (req, res) => {
  const adminId = req.user.id;
  const { job_id, project_input_file_id, category, output_from_job } = req.body;

  try {
    // Verify job belongs to admin
    const job = await JobDetails.findOne({
      where: { id: job_id, admin_id: adminId },
      include: [
        {
          model: ProjectDetails,
          as: "project",
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or not associated with this admin",
      });
    }

    // Verify project input file exists and belongs to same project
    const projectFile = await ProjectInputFiles.findOne({
      where: {
        id: project_input_file_id,
        project_id: job.project_id,
      },
    });

    if (!projectFile) {
      return res.status(404).json({
        success: false,
        message: "Project input file not found or not in same project",
      });
    }

    // Check if already linked
    const existing = await JobInputFiles.findOne({
      where: {
        job_id: job_id,
        project_input_file_id: project_input_file_id,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This file is already linked to this job",
      });
    }

    // Create linked entry
    const linkedFile = await JobInputFiles.create({
      project_id: job.project_id,
      job_id: job_id,
      project_input_file_id: project_input_file_id,
      category: category || null,
      output_from_job: output_from_job || null,
      uploaded_by: adminId,
      is_linked: true,
    });

    return res.status(201).json({
      success: true,
      message: "Project file linked to job successfully",
      data: linkedFile,
    });
  } catch (error) {
    console.error("LINK PROJECT FILE TO JOB ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all job input files - supports both job_id and project_id
export const getJobInputFiles = async (req, res) => {
  const adminId = req.user.id;
  const { job_id, project_id } = req.query;

  try {
    if (!job_id && !project_id) {
      return res.status(400).json({
        success: false,
        message: "Either job_id or project_id is required",
      });
    }

    const where = {};

    if (job_id) {
      const job = await JobDetails.findOne({
        where: { id: job_id, admin_id: adminId },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found or not associated with this admin",
        });
      }

      where.job_id = job_id;
    } else {
      const project = await ProjectDetails.findOne({
        where: { id: project_id, admin_id: adminId },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found or not associated with this admin",
        });
      }

      where.project_id = project_id;
    }

    const files = await JobInputFiles.findAll({
  where,
  include: [
    {
      model: ProjectInputFiles,
      as: "linkedProjectFile",
      attributes: [
        "id",
        "file_code",
        "original_file_name",
        "file_path",
        "file_size",
        "category",
      ],
    },
    {
      model: JobDetails,
      as: "job",
      attributes: ["id", "name"],
    },
    {
      model: db.AdminAuth,
      as: "uploader",
      attributes: ["id", "email"],
      include: [
        {
          model: AdminDetails,
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
    console.error("GET JOB INPUT FILES ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get single job input file
export const getJobInputFileById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const files = await JobInputFiles.findAll({
  where,
  include: [
    {
      model: ProjectInputFiles,
      as: "linkedProjectFile",
      attributes: [
        "id",
        "file_code",
        "original_file_name",
        "file_path",
        "file_size",
        "category",
      ],
    },
    {
      model: JobDetails,
      as: "job",
      attributes: ["id", "name"],
    },
    {
      model: db.AdminAuth,
      as: "uploader",
      attributes: ["id", "email"],
      include: [
        {
          model: AdminDetails,
          as: "details",
          attributes: ["first_name", "last_name"],
        },
      ],
    },
  ],
  order: [["uploaded_at", "DESC"]],
});

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check via job's project admin_id
    if (file.job.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error("GET JOB INPUT FILE BY ID ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update job input file metadata
export const updateJobInputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const { category, output_from_job } = req.body;

  try {
    const file = await JobInputFiles.findByPk(id, {
      include: [
        {
          model: JobDetails,
          as: "job",
        },
      ],
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.job.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Only allow metadata updates (not file replacement for linked files)
    if (category !== undefined) {
      file.category = category || null;
    }

    if (output_from_job !== undefined) {
      file.output_from_job = output_from_job || null;
    }

    await file.save();

    return res.status(200).json({
      success: true,
      message: "File metadata updated successfully",
      data: file,
    });
  } catch (error) {
    console.error("UPDATE JOB INPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Delete job input file
export const deleteJobInputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const file = await JobInputFiles.findByPk(id, {
      include: [
        {
          model: JobDetails,
          as: "job",
        },
      ],
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.job.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Only delete actual file if not linked
    if (!file.is_linked && file.file_path) {
      const filePath = path.resolve(file.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await file.destroy();

    return res.status(200).json({
      success: true,
      message: "File removed successfully",
    });
  } catch (error) {
    console.error("DELETE JOB INPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Download single file
export const downloadFile = async (req, res) => {
  const { path: filePath } = req.query;

  try {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.download(fullPath);
  } catch (error) {
    console.error("DOWNLOAD FILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download file",
    });
  }
};

// Download all job input files as zip
export const downloadJobInputFilesAsZip = async (req, res) => {
  const adminId = req.user.id;
  const { job_id } = req.query;

  try {
    // Verify job belongs to admin
    const job = await JobDetails.findOne({
      where: { id: job_id, admin_id: adminId },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Get all job input files
    const files = await JobInputFiles.findAll({
      where: { job_id },
      include: [
        {
          model: ProjectInputFiles,
          as: "linkedProjectFile",
        },
      ],
    });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found",
      });
    }

    // Create zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    res.attachment(`job-${job_id}-input-files.zip`);
    archive.pipe(res);

    // Add files to archive
    for (const file of files) {
      const filePath = file.is_linked
        ? path.resolve(file.linkedProjectFile.file_path)
        : path.resolve(file.file_path);

      const fileName = file.is_linked
        ? file.linkedProjectFile.original_file_name
        : file.original_file_name;

      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: fileName });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("DOWNLOAD ZIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create zip file",
    });
  }
};

// Download all job input files for a project as zip
export const downloadJobInputFilesByProjectAsZip = async (req, res) => {
  const adminId = req.user.id;
  const { project_id } = req.query;

  try {
    // Verify project belongs to admin
    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get all job input files for this project
    const files = await JobInputFiles.findAll({
      where: { project_id },
      include: [
        {
          model: ProjectInputFiles,
          as: "linkedProjectFile",
        },
      ],
    });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found",
      });
    }

    // Create zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    res.attachment(`project-${project_id}-job-input-files.zip`);
    archive.pipe(res);

    // Add files to archive
    for (const file of files) {
      const filePath = file.is_linked
        ? path.resolve(file.linkedProjectFile.file_path)
        : path.resolve(file.file_path);

      const fileName = file.is_linked
        ? file.linkedProjectFile.original_file_name
        : file.original_file_name;

      if (fs.existsSync(filePath)) {
        // Prefix with job folder
        const jobFolder = `Job_${file.job_id}`;
        archive.file(filePath, { name: `${jobFolder}/${fileName}` });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("DOWNLOAD PROJECT JOB INPUT ZIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create zip file",
    });
  }
};