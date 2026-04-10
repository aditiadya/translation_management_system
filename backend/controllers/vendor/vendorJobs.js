import db from "../../models/index.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import archiver from "archiver";

const {
  JobDetails,
  JobStatusHistory,
  ProjectDetails,
  VendorDetails,
  AdminService,
  AdminLanguagePair,
  AdminSpecialization,
  AdminCurrency,
  AdminUnits,
  Currency,
  ManagerDetails,
  Language,
  FlatRatePayables,
  UnitBasedPayables,
  JobInputFiles,
  JobOutputFiles,
  ProjectInputFiles,
  AdminAuth,
  AdminDetails,
} = db;

// Get all jobs assigned to the logged-in vendor
export const getVendorJobs = async (req, res) => {
  const authId = req.user.id;
  const {
    page = 1,
    limit = 50,
    status,
  } = req.query;

  try {
    // Find vendor by auth_id
    const vendor = await VendorDetails.findOne({
      where: { auth_id: authId },
      attributes: ["id"],
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const where = { vendor_id: vendor.id, status: { [Op.ne]: "Draft" } };
    if (status) where.status = status;

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const jobs = await JobDetails.findAndCountAll({
      where,
      include: [
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
        {
          model: ProjectDetails,
          as: "project",
          attributes: ["id", "project_name", "specialization_id", "primary_manager_id"],
          include: [
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
          ],
        },
        {
          model: JobStatusHistory,
          as: "statusHistory",
          attributes: ["id", "new_status", "changed_at"],
          required: false,
        },
      ],
      order: [["id", "DESC"]],
      offset,
      limit: parseInt(limit, 10),
    });

    // Process rows to extract started_at and completed_at from statusHistory
    const data = jobs.rows.map((job) => {
      const plain = job.toJSON();

      const startedEntry = plain.statusHistory?.find(
        (h) => h.new_status === "Started"
      );
      const completedEntry = plain.statusHistory?.find(
        (h) => h.new_status === "Completed" || h.new_status === "Completion Accepted"
      );

      plain.started_at = startedEntry?.changed_at || null;
      plain.completed_at = completedEntry?.changed_at || null;

      // Remove full statusHistory from response to keep it clean
      delete plain.statusHistory;

      return plain;
    });

    return res.status(200).json({
      success: true,
      meta: {
        total: jobs.count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      data,
    });
  } catch (err) {
    console.error("getVendorJobs err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single job detail for vendor
export const getVendorJobById = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;

  try {
    // Find vendor by auth_id
    const vendor = await VendorDetails.findOne({
      where: { auth_id: authId },
      attributes: ["id"],
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Fetch job ensuring it belongs to this vendor and is visible (not Draft)
    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: { [Op.ne]: "Draft" } },
      include: [
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
            { model: Language, as: "sourceLanguage", attributes: ["id", "name"] },
            { model: Language, as: "targetLanguage", attributes: ["id", "name"] },
          ],
        },
        {
          model: ProjectDetails,
          as: "project",
          attributes: ["id", "project_name", "specialization_id", "primary_manager_id"],
          include: [
            { model: AdminSpecialization, as: "specialization", attributes: ["id", "name"] },
            { model: ManagerDetails, as: "primaryManager", attributes: ["id", "first_name", "last_name"] },
          ],
        },
        {
          model: JobStatusHistory,
          as: "statusHistory",
          attributes: ["id", "old_status", "new_status", "changed_at", "changed_by", "comment", "auto_transitioned"],
          required: false,
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const plain = job.toJSON();

    // Extract started_at and completed_at
    const startedEntry = plain.statusHistory?.find((h) => h.new_status === "Started");
    const completedEntry = plain.statusHistory?.find(
      (h) => h.new_status === "Completed" || h.new_status === "Completion Accepted"
    );
    plain.started_at = startedEntry?.changed_at || null;
    plain.completed_at = completedEntry?.changed_at || null;

    // Fetch receivables (payables to vendor) - flat rate + unit based
    const flatRateIncludes = [
      {
        model: AdminCurrency,
        as: "currency",
        attributes: ["id"],
        include: [{ model: Currency, as: "currency", attributes: ["id", "code", "symbol", "name"] }],
      },
      { model: JobInputFiles, as: "file", attributes: ["id", "file_name", "file_code", "original_file_name"] },
    ];

    const [flatRows, unitRows] = await Promise.all([
      FlatRatePayables.findAll({
        where: { job_id: jobId },
        include: flatRateIncludes,
        order: [["id", "DESC"]],
      }),
      UnitBasedPayables.findAll({
        where: { job_id: jobId },
        include: [
          ...flatRateIncludes,
          { model: AdminUnits, as: "unit", attributes: ["id", "name"] },
        ],
        order: [["id", "DESC"]],
      }),
    ]);

    const receivables = [
      ...flatRows.map((r) => ({ ...r.toJSON(), type: "flat_rate" })),
      ...unitRows.map((r) => ({ ...r.toJSON(), type: "unit_based" })),
    ];
    receivables.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Fetch job input files
    const inputFiles = await JobInputFiles.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: ProjectInputFiles,
          as: "linkedProjectFile",
          attributes: ["id", "file_code", "original_file_name", "file_path", "file_size", "category"],
        },
      ],
      order: [["uploaded_at", "DESC"]],
    });

    // Fetch job output files
    const outputFiles = await JobOutputFiles.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: AdminAuth,
          as: "adminUploader",
          attributes: ["id", "email"],
          include: [{ model: AdminDetails, as: "details", attributes: ["first_name", "last_name"] }],
        },
        {
          model: VendorDetails,
          as: "vendorUploader",
          attributes: ["id", "company_name"],
        },
      ],
      order: [["uploaded_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: {
        ...plain,
        receivables,
        inputFiles,
        outputFiles,
      },
    });
  } catch (err) {
    console.error("getVendorJobById err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Accept job offer (vendor)
export const acceptOffer = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;

  try {
    const vendor = await VendorDetails.findOne({ where: { auth_id: authId }, attributes: ["id"] });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: "Offered to Vendor" },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or cannot be accepted in its current state" });
    }

    await job.update({ status: "Offer Accepted" });
    await JobStatusHistory.create({
      job_id: jobId,
      old_status: "Offered to Vendor",
      new_status: "Offer Accepted",
      changed_by: "vendor",
      auto_transitioned: false,
    });

    // Auto-start if configured
    if (job.auto_start_on_vendor_acceptance) {
      await job.update({ status: "Started" });
      await JobStatusHistory.create({
        job_id: jobId,
        old_status: "Offer Accepted",
        new_status: "Started",
        changed_by: "vendor",
        auto_transitioned: true,
      });
    }

    return res.status(200).json({ success: true, message: "Offer accepted successfully" });
  } catch (err) {
    console.error("acceptOffer err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject job offer (vendor)
export const rejectOffer = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;
  const { comment = "" } = req.body;

  try {
    const vendor = await VendorDetails.findOne({ where: { auth_id: authId }, attributes: ["id"] });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: "Offered to Vendor" },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or cannot be rejected in its current state" });
    }

    await job.update({ status: "Offer Rejected" });
    await JobStatusHistory.create({
      job_id: jobId,
      old_status: "Offered to Vendor",
      new_status: "Offer Rejected",
      changed_by: "vendor",
      comment: comment || null,
      auto_transitioned: false,
    });

    return res.status(200).json({ success: true, message: "Offer rejected successfully" });
  } catch (err) {
    console.error("rejectOffer err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Complete job (vendor)
export const completeJob = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;

  try {
    const vendor = await VendorDetails.findOne({ where: { auth_id: authId }, attributes: ["id"] });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: "Started" },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or cannot be completed in its current state" });
    }

    // Ensure at least one output file uploaded by this vendor exists
    const vendorOutputCount = await JobOutputFiles.count({
      where: { job_id: jobId, uploaded_by_vendor: vendor.id },
    });
    if (vendorOutputCount === 0) {
      return res.status(400).json({ success: false, message: "You must upload at least one output file before completing the job" });
    }

    await job.update({ status: "Completed" });
    await JobStatusHistory.create({
      job_id: jobId,
      old_status: "Started",
      new_status: "Completed",
      changed_by: "vendor",
      auto_transitioned: false,
    });

    return res.status(200).json({ success: true, message: "Job completed successfully" });
  } catch (err) {
    console.error("completeJob err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upload output file (vendor)
export const uploadVendorOutputFile = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    const vendor = await VendorDetails.findOne({ where: { auth_id: authId }, attributes: ["id"] });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: "Started" },
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or not in Started status" });
    }

    const relativePath = path.posix.join("uploads", "job_output_files", file.filename);

    const newFile = await JobOutputFiles.create({
      project_id: job.project_id,
      job_id: jobId,
      original_file_name: file.originalname,
      file_name: file.filename,
      file_path: relativePath,
      file_size: file.size,
      file_type: file.mimetype,
      uploaded_by_vendor: vendor.id,
      input_for_job: req.body.input_for_job || null,
      is_project_output: false,
    });

    return res.status(201).json({
      success: true,
      message: "Output file uploaded successfully",
      data: newFile,
    });
  } catch (err) {
    console.error("uploadVendorOutputFile err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Download all input files for a job as zip (vendor)
export const downloadVendorInputFilesAsZip = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;

  try {
    const vendor = await VendorDetails.findOne({ where: { auth_id: authId }, attributes: ["id"] });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: { [Op.ne]: "Draft" } },
    });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const files = await JobInputFiles.findAll({
      where: { job_id: jobId },
      include: [{ model: ProjectInputFiles, as: "linkedProjectFile" }],
    });

    if (files.length === 0) {
      return res.status(404).json({ success: false, message: "No files found" });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment(`job-${jobId}-input-files.zip`);
    archive.pipe(res);

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
  } catch (err) {
    console.error("downloadVendorInputFilesAsZip err:", err);
    return res.status(500).json({ success: false, message: "Failed to create zip file" });
  }
};

// Download all output files for a job as zip (vendor)
export const downloadVendorOutputFilesAsZip = async (req, res) => {
  const authId = req.user.id;
  const jobId = req.params.id;

  try {
    const vendor = await VendorDetails.findOne({ where: { auth_id: authId }, attributes: ["id"] });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

    const job = await JobDetails.findOne({
      where: { id: jobId, vendor_id: vendor.id, status: { [Op.ne]: "Draft" } },
    });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const files = await JobOutputFiles.findAll({ where: { job_id: jobId } });

    if (files.length === 0) {
      return res.status(404).json({ success: false, message: "No files found" });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment(`job-${jobId}-output-files.zip`);
    archive.pipe(res);

    for (const file of files) {
      const filePath = path.resolve(file.file_path);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.original_file_name });
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error("downloadVendorOutputFilesAsZip err:", err);
    return res.status(500).json({ success: false, message: "Failed to create zip file" });
  }
};
