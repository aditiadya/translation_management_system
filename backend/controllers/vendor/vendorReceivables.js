import db from "../../models/index.js";

const {
  FlatRatePayables,
  UnitBasedPayables,
  JobDetails,
  VendorDetails,
  AdminService,
  AdminLanguagePair,
  AdminCurrency,
  AdminUnits,
  Currency,
  Language,
  JobInputFiles,
} = db;

// Shared includes for flat rate
const flatRateIncludes = [
  {
    model: JobDetails,
    as: "job",
    attributes: ["id", "name", "status", "service_id", "language_pair_id"],
    include: [
      { model: AdminService, as: "service", attributes: ["id", "name"] },
      {
        model: AdminLanguagePair,
        as: "languagePair",
        attributes: ["id"],
        include: [
          { model: Language, as: "sourceLanguage", attributes: ["id", "name"] },
          { model: Language, as: "targetLanguage", attributes: ["id", "name"] },
        ],
      },
    ],
  },
  {
    model: AdminCurrency,
    as: "currency",
    attributes: ["id"],
    include: [{ model: Currency, as: "currency", attributes: ["id", "code", "symbol", "name"] }],
  },
  { model: JobInputFiles, as: "file", attributes: ["id", "file_name", "file_code", "original_file_name"] },
];

// Shared includes for unit based (adds unit)
const unitBasedIncludes = [
  ...flatRateIncludes,
  { model: AdminUnits, as: "unit", attributes: ["id", "name"] },
];

// Get all receivables for the logged-in vendor
export const getVendorReceivables = async (req, res) => {
  const authId = req.user.id;

  try {
    const vendor = await VendorDetails.findOne({
      where: { auth_id: authId },
      attributes: ["id"],
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // Get all job IDs belonging to this vendor
    const vendorJobs = await JobDetails.findAll({
      where: { vendor_id: vendor.id },
      attributes: ["id"],
    });
    const jobIds = vendorJobs.map((j) => j.id);

    if (jobIds.length === 0) {
      return res.status(200).json({ success: true, data: [], meta: { total: 0 } });
    }

    const Op = db.Sequelize.Op;

    const [flatRows, unitRows] = await Promise.all([
      FlatRatePayables.findAll({
        where: { job_id: { [Op.in]: jobIds } },
        include: flatRateIncludes,
        order: [["id", "DESC"]],
      }),
      UnitBasedPayables.findAll({
        where: { job_id: { [Op.in]: jobIds } },
        include: unitBasedIncludes,
        order: [["id", "DESC"]],
      }),
    ]);

    const merged = [
      ...flatRows.map((r) => ({ ...r.toJSON(), type: "flat_rate" })),
      ...unitRows.map((r) => ({ ...r.toJSON(), type: "unit_based" })),
    ];
    merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      meta: { total: merged.length },
      data: merged,
    });
  } catch (err) {
    console.error("getVendorReceivables err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single receivable detail
export const getVendorReceivableById = async (req, res) => {
  const authId = req.user.id;
  const { id } = req.params;
  const { type } = req.query; // "flat_rate" or "unit_based"

  try {
    const vendor = await VendorDetails.findOne({
      where: { auth_id: authId },
      attributes: ["id"],
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    let record;

    if (type === "unit_based") {
      record = await UnitBasedPayables.findByPk(id, { include: unitBasedIncludes });
    } else {
      record = await FlatRatePayables.findByPk(id, { include: flatRateIncludes });
    }

    if (!record) {
      return res.status(404).json({ success: false, message: "Receivable not found" });
    }

    // Verify this receivable's job belongs to this vendor
    const job = await JobDetails.findOne({
      where: { id: record.job_id, vendor_id: vendor.id },
    });

    if (!job) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const plain = record.toJSON();
    plain.type = type === "unit_based" ? "unit_based" : "flat_rate";

    return res.status(200).json({ success: true, data: plain });
  } catch (err) {
    console.error("getVendorReceivableById err:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
