import db from "../../models/index.js";
const { AdminDetails } = db;
import { pickAllowed } from "../../utils/pickAllowed.js";

const ALLOWED_FIELDS = [
  "account_type",
  "company_name",
  "country",
  "time_zone",
  "first_name",
  "last_name",
  "username",
  "phone",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Username already taken" },
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
  return {
    code: 500,
    body: { success: false, message: "Something went wrong" },
  };
};

export const updateAdminDetails = async (req, res) => {
  try {
    const updateData = pickAllowed(req.body, ALLOWED_FIELDS);
    const [updated] = await AdminDetails.update(updateData, {
      where: { admin_id: req.user.id },
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "No details found." });
    const updatedData = await AdminDetails.findOne({
      where: { admin_id: req.user.id },
    });
    return res.status(200).json({ success: true, data: updatedData });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const getAdminDetailsById = async (req, res) => {
  try {
    const data = await AdminDetails.findOne({
      where: { admin_id: req.user.id },
    });
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "No details found." });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const deleteAdminDetails = async (req, res) => {
  try {
    const deleted = await AdminDetails.destroy({
      where: { admin_id: req.user.id },
    });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "No details found." });
    return res
      .status(200)
      .json({ success: true, message: "Admin details deleted" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};
