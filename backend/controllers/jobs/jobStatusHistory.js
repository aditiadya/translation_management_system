import db from "../../models/index.js";
import Joi from "joi";

const { JobDetails, JobStatusHistory } = db;

// Valid status transitions
const STATUS_TRANSITIONS = {
  Draft: ["Offered to Vendor", "Cancelled"],
  "Offered to Vendor": ["Offer Accepted", "Offer Rejected", "Cancelled"],
  "Offer Accepted": ["Started", "Cancelled"],
  "Offer Rejected": ["Offered to Vendor", "Cancelled"],
  Started: ["Completed", "Hold", "Cancelled"],
  Hold: ["Started", "Cancelled"],
  Completed: ["Completion Accepted", "Completion Rejected"],
  "Completion Accepted": [],
  "Completion Rejected": ["Started", "Cancelled"],
  Cancelled: [],
};

const changeStatusSchema = Joi.object({
  new_status: Joi.string()
    .valid(
      "Draft",
      "Offered to Vendor",
      "Offer Accepted",
      "Offer Rejected",
      "Started",
      "Completed",
      "Hold",
      "Completion Accepted",
      "Completion Rejected",
      "Cancelled"
    )
    .required(),
  comment: Joi.string().optional().allow(null, ""),
  changed_by: Joi.string().valid("admin", "vendor").default("admin"),
});

// Change job status (Admin)
export const changeJobStatus = async (req, res) => {
  const adminId = req.user.id;
  const jobId = req.params.id;
  const { new_status, comment, changed_by = "admin" } = req.body;

  const { error } = changeStatusSchema.validate({
    new_status,
    comment,
    changed_by,
  });
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const result = await JobDetails.sequelize.transaction(async (t) => {
      // Get current job
      const job = await JobDetails.findOne({
        where: { id: jobId, admin_id: adminId },
        transaction: t,
      });

      if (!job) {
        throw { name: "NotFound", message: "Job not found" };
      }

      const currentStatus = job.status;

      // Check if same status
      if (currentStatus === new_status) {
        throw {
          name: "BadRequest",
          message: "Job is already in this status",
        };
      }

      // Validate transition
      const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
      if (!allowedTransitions.includes(new_status)) {
        throw {
          name: "BadRequest",
          message: `Cannot transition from ${currentStatus} to ${new_status}`,
        };
      }

      // Update job status
      await job.update({ status: new_status }, { transaction: t });

      // Create status history
      await JobStatusHistory.create(
        {
          job_id: jobId,
          old_status: currentStatus,
          new_status: new_status,
          changed_at: new Date(),
          changed_by: changed_by,
          comment: comment || null,
          auto_transitioned: false,
        },
        { transaction: t }
      );

      return job;
    });

    return res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("changeJobStatus err:", err);

    if (err?.name === "NotFound")
      return res
        .status(404)
        .json({ success: false, message: err.message || "Job not found" });

    if (err?.name === "BadRequest")
      return res
        .status(400)
        .json({ success: false, message: err.message || "Invalid request" });

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Vendor accepts job offer
export const vendorAcceptOffer = async (req, res) => {
  const vendorId = req.user.id; // Assuming vendor is authenticated
  const jobId = req.params.id;
  const { comment } = req.body;

  try {
    const result = await JobDetails.sequelize.transaction(async (t) => {
      // Get job
      const job = await JobDetails.findOne({
        where: { id: jobId, vendor_id: vendorId },
        transaction: t,
      });

      if (!job) {
        throw { name: "NotFound", message: "Job not found" };
      }

      if (job.status !== "Offered to Vendor") {
        throw {
          name: "BadRequest",
          message: "Job is not in 'Offered to Vendor' status",
        };
      }

      // Check auto_start_on_vendor_acceptance
      if (job.auto_start_on_vendor_acceptance) {
        // Auto-transition: Offered to Vendor -> Offer Accepted -> Started
        
        // First transition to Offer Accepted
        await JobStatusHistory.create(
          {
            job_id: jobId,
            old_status: "Offered to Vendor",
            new_status: "Offer Accepted",
            changed_at: new Date(),
            changed_by: "vendor",
            comment: comment || "Vendor accepted the offer",
            auto_transitioned: true,
          },
          { transaction: t }
        );

        // Then transition to Started
        await job.update({ status: "Started" }, { transaction: t });

        await JobStatusHistory.create(
          {
            job_id: jobId,
            old_status: "Offer Accepted",
            new_status: "Started",
            changed_at: new Date(),
            changed_by: "admin",
            comment: "Auto-started based on vendor acceptance",
            auto_transitioned: true,
          },
          { transaction: t }
        );
      } else {
        // Manual transition: Offered to Vendor -> Offer Accepted
        await job.update({ status: "Offer Accepted" }, { transaction: t });

        await JobStatusHistory.create(
          {
            job_id: jobId,
            old_status: "Offered to Vendor",
            new_status: "Offer Accepted",
            changed_at: new Date(),
            changed_by: "vendor",
            comment: comment || "Vendor accepted the offer",
            auto_transitioned: false,
          },
          { transaction: t }
        );
      }

      return job;
    });

    return res.status(200).json({
      success: true,
      message: "Offer accepted successfully",
      data: result,
    });
  } catch (err) {
    console.error("vendorAcceptOffer err:", err);

    if (err?.name === "NotFound")
      return res
        .status(404)
        .json({ success: false, message: err.message || "Job not found" });

    if (err?.name === "BadRequest")
      return res
        .status(400)
        .json({ success: false, message: err.message || "Invalid request" });

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Vendor rejects job offer
export const vendorRejectOffer = async (req, res) => {
  const vendorId = req.user.id;
  const jobId = req.params.id;
  const { comment } = req.body;

  try {
    const result = await JobDetails.sequelize.transaction(async (t) => {
      const job = await JobDetails.findOne({
        where: { id: jobId, vendor_id: vendorId },
        transaction: t,
      });

      if (!job) {
        throw { name: "NotFound", message: "Job not found" };
      }

      if (job.status !== "Offered to Vendor") {
        throw {
          name: "BadRequest",
          message: "Job is not in 'Offered to Vendor' status",
        };
      }

      await job.update({ status: "Offer Rejected" }, { transaction: t });

      await JobStatusHistory.create(
        {
          job_id: jobId,
          old_status: "Offered to Vendor",
          new_status: "Offer Rejected",
          changed_at: new Date(),
          changed_by: "vendor",
          comment: comment || "Vendor rejected the offer",
          auto_transitioned: false,
        },
        { transaction: t }
      );

      return job;
    });

    return res.status(200).json({
      success: true,
      message: "Offer rejected",
      data: result,
    });
  } catch (err) {
    console.error("vendorRejectOffer err:", err);

    if (err?.name === "NotFound")
      return res
        .status(404)
        .json({ success: false, message: err.message || "Job not found" });

    if (err?.name === "BadRequest")
      return res
        .status(400)
        .json({ success: false, message: err.message || "Invalid request" });

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Start job (Admin - manual start after Offer Accepted)
export const startJob = async (req, res) => {
  const adminId = req.user.id;
  const jobId = req.params.id;
  const { comment } = req.body;

  try {
    const result = await JobDetails.sequelize.transaction(async (t) => {
      const job = await JobDetails.findOne({
        where: { id: jobId, admin_id: adminId },
        transaction: t,
      });

      if (!job) {
        throw { name: "NotFound", message: "Job not found" };
      }

      if (job.status !== "Offer Accepted" && job.status !== "Hold") {
        throw {
          name: "BadRequest",
          message: `Cannot start job from ${job.status} status`,
        };
      }

      await job.update({ status: "Started" }, { transaction: t });

      await JobStatusHistory.create(
        {
          job_id: jobId,
          old_status: job.status,
          new_status: "Started",
          changed_at: new Date(),
          changed_by: "admin",
          comment: comment || "Job started by admin",
          auto_transitioned: false,
        },
        { transaction: t }
      );

      return job;
    });

    return res.status(200).json({
      success: true,
      message: "Job started successfully",
      data: result,
    });
  } catch (err) {
    console.error("startJob err:", err);

    if (err?.name === "NotFound")
      return res
        .status(404)
        .json({ success: false, message: err.message || "Job not found" });

    if (err?.name === "BadRequest")
      return res
        .status(400)
        .json({ success: false, message: err.message || "Invalid request" });

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get job status timeline
export const getJobStatusTimeline = async (req, res) => {
  const jobId = req.params.id;

  try {
    const statusHistory = await JobStatusHistory.findAll({
      where: { job_id: jobId },
      order: [["changed_at", "ASC"]],
    });

    // Format timeline
    const timeline = statusHistory.map((item) => ({
      status: item.new_status,
      changed_at: item.changed_at,
      changed_by: item.changed_by,
      comment: item.comment,
      auto_transitioned: item.auto_transitioned,
    }));

    return res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (err) {
    console.error("getJobStatusTimeline err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};