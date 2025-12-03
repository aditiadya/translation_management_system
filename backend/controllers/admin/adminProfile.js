import db from "../../models/index.js";
const { AdminProfile } = db;
import { pickAllowed } from "../../utils/pickAllowed.js";

const ALLOWED_FIELDS = [
  "gender",
  "teams_id",
  "zoom_id",
  "language_email",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Duplicate entry not allowed" },
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

const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const formatProfile = (profile) => {
  if (!profile) return null;
  const json = profile.toJSON();
  return {
    ...json,
    gender: capitalizeFirst(json.gender),
  };
};

// Add
export const addAdminProfile = async (req, res) => {
  try {
    const profileData = pickAllowed(req.body, ALLOWED_FIELDS);
    profileData.admin_id = req.user.id;

    const existing = await AdminProfile.findOne({
      where: { admin_id: req.user.id },
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Profile already exists" });
    }

    const newProfile = await AdminProfile.create(profileData);
    return res.status(201).json({ success: true, data: formatProfile(newProfile) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get
export const getAdminProfile = async (req, res) => {
  try {
    const data = await AdminProfile.findOne({
      where: { admin_id: req.user.id },
    });
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "No profile found." });

    return res.status(200).json({ success: true, data: formatProfile(data) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update
export const updateAdminProfile = async (req, res) => {
  try {
    const updateData = pickAllowed(req.body, ALLOWED_FIELDS);
    const [updated] = await AdminProfile.update(updateData, {
      where: { admin_id: req.user.id },
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "No profile found." });

    const updatedData = await AdminProfile.findOne({
      where: { admin_id: req.user.id },
    });
    return res.status(200).json({ success: true, data: formatProfile(updatedData) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteAdminProfile = async (req, res) => {
  try {
    const deleted = await AdminProfile.destroy({
      where: { admin_id: req.user.id },
    });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "No profile found." });
    return res
      .status(200)
      .json({ success: true, message: "Admin profile deleted" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};