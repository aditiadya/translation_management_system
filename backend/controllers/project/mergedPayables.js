import db from "../../models/index.js";

const {
  FlatRatePayables,
  UnitBasedPayables,
  ProjectDetails,
  JobDetails,
  AdminCurrency,
  Currency,
  JobInputFiles,
  AdminUnits,
} = db;

// Shared associations for FlatRate payables
const flatRateIncludes = [
  { model: ProjectDetails, as: "project", attributes: ["id", "project_name"] },
  { model: JobDetails, as: "job", attributes: ["id", "job_name"] },
  {
    model: AdminCurrency,
    as: "currency",
    attributes: ["id"],
    include: [{ model: Currency, as: "currency", attributes: ["id", "code", "symbol", "name"] }],
  },
  { model: JobInputFiles, as: "file", attributes: ["id", "file_name", "file_code"] },
];

// Shared associations for UnitBased payables
const unitBasedIncludes = [
  ...flatRateIncludes,
  { model: AdminUnits, as: "unit", attributes: ["id", "name"] },
];

/**
 * GET /payables/merged?project_id=X&page=1&limit=25
 *
 * Returns a merged, sorted list of both FlatRatePayables and
 * UnitBasedPayables for the given project.
 *
 * Optionally filter by job_id: ?project_id=X&job_id=Y
 *
 * Each row carries a `type` field: "flat_rate" | "unit_based"
 * so the frontend can distinguish them without mixing data between rows.
 */
export const getMergedPayables = async (req, res) => {
  const adminId = req.user.id;
  const { project_id, job_id, page = 1, limit = 25 } = req.query;

  if (!project_id)
    return res.status(400).json({ success: false, message: "project_id is required" });

  try {
    // Verify project ownership once
    const project = await ProjectDetails.findOne({
      where: { id: project_id, admin_id: adminId },
    });
    if (!project)
      return res.status(404).json({ success: false, message: "Project not found" });

    const whereClause = { project_id };
    if (job_id) whereClause.job_id = job_id;

    // Fetch both tables in parallel (no pagination at DB level — we merge then paginate)
    const [flatRows, unitRows] = await Promise.all([
      FlatRatePayables.findAll({
        where: whereClause,
        include: flatRateIncludes,
        order: [["id", "DESC"]],
      }),
      UnitBasedPayables.findAll({
        where: whereClause,
        include: unitBasedIncludes,
        order: [["id", "DESC"]],
      }),
    ]);

    // Tag each row with its type and normalize to a shared shape
    const tagged = [
      ...flatRows.map((r) => ({
        ...r.toJSON(),
        type: "flat_rate",
        // unit-based fields not present — leave undefined so frontend shows "—"
        unit_amount: undefined,
        unit: undefined,
        price_per_unit: undefined,
      })),
      ...unitRows.map((r) => ({
        ...r.toJSON(),
        type: "unit_based",
      })),
    ];

    // Sort merged list by createdAt descending (most recent first)
    tagged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Manual pagination over merged list
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = parseInt(limit, 10);
    const total = tagged.length;
    const paginated = tagged.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.status(200).json({
      success: true,
      meta: { total, page: pageNum, limit: limitNum },
      data: paginated,
    });
  } catch (err) {
    console.error("getMergedPayables err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};