import db from "../../models/index.js";

const { ProjectDetails, ProjectStatusHistory } = db;

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

export const getProjectStatusHistory = async (req, res) => {
  const adminId = req.user.id;
  const projectId = req.params.id;

  try {
    const project = await ProjectDetails.findOne({
      where: { id: projectId, admin_id: adminId },
      attributes: ["id", "status"],
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const history = await ProjectStatusHistory.findAll({
      where: { project_id: projectId },
      order: [["changed_at", "ASC"]],
      attributes: ["id", "old_status", "new_status", "changed_at", "comment"],
    });

    return res.status(200).json({
      success: true,
      data: {
        project_id: project.id,
        current_status: project.status,
        history,
      },
    });
  } catch (err) {
    console.error("getProjectStatusHistory err:", err);
    const errResp = toClientError(err);
    return res.status(errResp.code || 500).json(errResp.body || { success: false, message: "Server error" });
  }
};