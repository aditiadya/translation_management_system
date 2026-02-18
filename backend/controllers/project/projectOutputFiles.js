import fs from "fs";
import path from "path";
import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import archiver from "archiver";

const {
  ProjectOutputFiles,
  ProjectDetails,
  JobOutputFiles,
  JobDetails,
  AdminDetails
} = db;

const ALLOWED_FIELDS = ["project_id", "job_id"];

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

// Upload file directly to project output
export const createProjectOutputFile = async (req, res) => {
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

    // Verify project belongs to admin
    const project = await ProjectDetails.findOne({
      where: { id: data.project_id, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or not associated with this admin",
      });
    }

    // Verify job belongs to project (if job_id provided)
    if (data.job_id) {
      const job = await JobDetails.findOne({
        where: {
          id: data.job_id,
          project_id: data.project_id,
          admin_id: adminId,
        },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found or not associated with this project",
        });
      }
    }

    const relativePath = path.posix.join(
      "uploads",
      "project_output_files",
      file.filename
    );

    const newFile = await ProjectOutputFiles.create({
      project_id: data.project_id,
      job_id: data.job_id,
      original_file_name: file.originalname,
      file_name: file.filename,
      file_path: relativePath,
      file_size: file.size,
      uploaded_by: adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Project output file uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    console.error("CREATE PROJECT OUTPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all project output files
export const getProjectOutputFiles = async (req, res) => {
  const adminId = req.user.id;
  const { project_id } = req.query;

  try {
    if (!project_id) {
      return res.status(400).json({
        success: false,
        message: "project_id is required",
      });
    }

    // Verify project belongs to admin
    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or not associated with this admin",
      });
    }

    const files = await ProjectOutputFiles.findAll({
  where: { project_id },
  include: [
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
    console.error("GET PROJECT OUTPUT FILES ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get single project output file
export const getProjectOutputFileById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const files = await ProjectOutputFiles.findAll({
  where: { project_id },
  include: [
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

    if (file.project.admin_id !== adminId) {
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
    console.error("GET PROJECT OUTPUT FILE BY ID ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update project output file
export const updateProjectOutputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const file = req.file;

  try {
    const outputFile = await ProjectOutputFiles.findByPk(id, {
      include: [
        {
          model: ProjectDetails,
          as: "project",
        },
      ],
    });

    if (!outputFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (outputFile.project.admin_id !== adminId) {
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
        "project_output_files",
        file.filename
      );

      outputFile.original_file_name = file.originalname;
      outputFile.file_name = file.filename;
      outputFile.file_size = file.size;
      outputFile.file_path = newPath;
    }

    await outputFile.save();

    return res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: outputFile,
    });
  } catch (error) {
    console.error("UPDATE PROJECT OUTPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

// Delete project output file
export const deleteProjectOutputFile = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const file = await ProjectOutputFiles.findByPk(id, {
      include: [
        {
          model: ProjectDetails,
          as: "project",
        },
      ],
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
        message: "Access denied",
      });
    }

    // Check if this file came from job output
    const jobOutputFile = await JobOutputFiles.findOne({
      where: {
        file_code: file.file_code,
        is_project_output: true,
      },
    });

    // If it came from job output, update the flag
    if (jobOutputFile) {
      jobOutputFile.is_project_output = false;
      await jobOutputFile.save();
    } else {
      // Only delete physical file if it was directly uploaded
      if (file.file_path) {
        const filePath = path.resolve(file.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await file.destroy();

    return res.status(200).json({
      success: true,
      message: "File removed from project output successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT OUTPUT FILE ERROR:", error);
    const err = toFileError(error);
    return res.status(err.code).json(err.body);
  }
};

export const downloadProjectOutputFilesAsZip = async (req, res) => {
  const adminId = req.user.id;
  const { project_id } = req.query;

  try {
    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const files = await ProjectOutputFiles.findAll({
      where: { project_id },
    });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No files found",
      });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment(`project-${project_id}-output-files.zip`);
    archive.pipe(res);

    for (const file of files) {
      const filePath = path.resolve(file.file_path);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.original_file_name });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("DOWNLOAD PROJECT OUTPUT ZIP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create zip file",
    });
  }
};