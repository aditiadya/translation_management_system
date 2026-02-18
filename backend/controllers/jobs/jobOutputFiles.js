import fs from "fs";
import path from "path";
import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import archiver from "archiver";

const { JobOutputFiles, JobDetails, ProjectDetails, AdminDetails } = db;

const ALLOWED_FIELDS = ["job_id", "input_for_job"];

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

// Upload job output file (admin)
export const createJobOutputFile = async (req, res) => {
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
      "job_output_files",
      file.filename
    );

    const newFile = await JobOutputFiles.create({
      project_id: job.project_id,
      job_id: data.job_id,
      original_file_name: file.originalname,
      file_name: file.filename,
      file_path: relativePath,
      file_size: file.size,
      file_type: file.mimetype,
      uploaded_by: adminId,
      input_for_job: data.input_for_job || null,
      is_project_output: false,
    });

    return res.status(201).json({
      success: true,
      message: "Job output file uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    console.error("CREATE JOB OUTPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all job output files - supports both job_id and project_id
export const getJobOutputFiles = async (req, res) => {
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

    const files = await JobOutputFiles.findAll({
  where,
  include: [
    {
      model: JobDetails,
      as: "job",
      attributes: ["id", "name"],
    },
    {
      model: db.AdminAuth,
      as: "adminUploader",
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
    console.error("GET JOB OUTPUT FILES ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get single job output file
export const getJobOutputFileById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const file = await JobOutputFiles.findByPk(id, {
      include: [
        {
          model: JobDetails,
          as: "job",
          include: [
            {
              model: ProjectDetails,
              as: "project",
              attributes: ["id", "admin_id"],
            },
          ],
        },
      ],
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check via job's admin_id
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
    console.error("GET JOB OUTPUT FILE BY ID ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update job output file
export const updateJobOutputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const file = req.file;
  const { input_for_job } = req.body;

  try {
    const outputFile = await JobOutputFiles.findByPk(id, {
      include: [
        {
          model: JobDetails,
          as: "job",
        },
      ],
    });

    if (!outputFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (outputFile.job.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Replace file if new one uploaded
    if (file) {
      // Delete old file
      if (outputFile.file_path) {
        const oldPath = path.resolve(outputFile.file_path);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const newPath = path.posix.join(
        "uploads",
        "job_output_files",
        file.filename
      );

      outputFile.original_file_name = file.originalname;
      outputFile.file_name = file.filename;
      outputFile.file_size = file.size;
      outputFile.file_type = file.mimetype;
      outputFile.file_path = newPath;
    }

    if (input_for_job !== undefined) {
      outputFile.input_for_job = input_for_job || null;
    }

    await outputFile.save();

    return res.status(200).json({
      success: true,
      message: file
        ? "File and details updated successfully"
        : "File details updated successfully",
      data: outputFile,
    });
  } catch (error) {
    console.error("UPDATE JOB OUTPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Delete job output file
export const deleteJobOutputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const file = await JobOutputFiles.findByPk(id, {
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

    // Check if file is added to project output
    if (file.is_project_output) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete: File is added to project output. Remove from project output first.",
      });
    }

    // Delete physical file
    if (file.file_path) {
      const filePath = path.resolve(file.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await file.destroy();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB OUTPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Add job output to project output
export const addToProjectOutput = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const jobOutputFile = await JobOutputFiles.findByPk(id, {
      include: [
        {
          model: JobDetails,
          as: "job",
        },
      ],
    });

    if (!jobOutputFile) {
      return res.status(404).json({
        success: false,
        message: "Job output file not found",
      });
    }

    if (jobOutputFile.job.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (jobOutputFile.is_project_output) {
      return res.status(400).json({
        success: false,
        message: "File is already added to project output",
      });
    }

    const { ProjectOutputFiles } = db;

    // Create project output entry WITHOUT file_code
    // so the beforeValidate hook auto-generates a new unique PO#### code
    await ProjectOutputFiles.create({
      project_id: jobOutputFile.project_id,
      job_id: jobOutputFile.job_id,
      file_name: jobOutputFile.file_name,
      original_file_name: jobOutputFile.original_file_name,
      file_path: jobOutputFile.file_path,
      file_size: jobOutputFile.file_size,
      uploaded_by: adminId,
    });

    // Update flag on job output file
    jobOutputFile.is_project_output = true;
    await jobOutputFile.save();

    return res.status(200).json({
      success: true,
      message: "File added to project output successfully",
      data: jobOutputFile,
    });
  } catch (error) {
    console.error("ADD TO PROJECT OUTPUT ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};



// Download all job output files as zip
export const downloadJobOutputFilesAsZip = async (req, res) => {
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

    // Get all job output files
    const files = await JobOutputFiles.findAll({
      where: { job_id },
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

    res.attachment(`job-${job_id}-output-files.zip`);
    archive.pipe(res);

    // Add files to archive
    for (const file of files) {
      const filePath = path.resolve(file.file_path);

      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.original_file_name });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("DOWNLOAD OUTPUT ZIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create zip file",
    });
  }
};

// Download all job output files for a project as zip
export const downloadJobOutputFilesByProjectAsZip = async (req, res) => {
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

    // Get all job output files for this project
    const files = await JobOutputFiles.findAll({
      where: { project_id },
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

    res.attachment(`project-${project_id}-job-output-files.zip`);
    archive.pipe(res);

    // Add files to archive
    for (const file of files) {
      const filePath = path.resolve(file.file_path);

      if (fs.existsSync(filePath)) {
        // Prefix with job folder
        const jobFolder = `Job_${file.job_id}`;
        archive.file(filePath, { name: `${jobFolder}/${file.original_file_name}` });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("DOWNLOAD PROJECT JOB OUTPUT ZIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create zip file",
    });
  }
};