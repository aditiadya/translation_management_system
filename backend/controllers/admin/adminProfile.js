import db from "../../models/index.js";
const { AdminProfile, AdminProfileImage } = db;
import { pickAllowed } from "../../utils/pickAllowed.js";
import fs from "fs";
import path from "path";

const ALLOWED_FIELDS = [
  "gender",
  "teams_id",
  "zoom_id",
  "language_email",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return { code: 400, body: { success: false, message: "Duplicate entry not allowed" } };
  }
  if (error?.name === "SequelizeValidationError") {
    return {
      code: 400,
      body: { success: false, message: "Invalid data", details: error.errors?.map((e) => e.message) },
    };
  }
  return { code: 500, body: { success: false, message: "Something went wrong" } };
};

const capitalizeFirst = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const formatProfile = (profile) => {
  if (!profile) return null;
  const json = profile.toJSON();
  return { ...json, gender: capitalizeFirst(json.gender) };
};

// ─── Existing controllers (unchanged) ───────────────────────────────────────

export const addAdminProfile = async (req, res) => {
  try {
    const profileData = pickAllowed(req.body, ALLOWED_FIELDS);
    profileData.admin_id = req.user.id;

    const existing = await AdminProfile.findOne({ where: { admin_id: req.user.id } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Profile already exists" });
    }

    const newProfile = await AdminProfile.create(profileData);
    return res.status(201).json({ success: true, data: formatProfile(newProfile) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const data = await AdminProfile.findOne({ where: { admin_id: req.user.id } });
    if (!data) return res.status(404).json({ success: false, message: "No profile found." });
    return res.status(200).json({ success: true, data: formatProfile(data) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const updateData = pickAllowed(req.body, ALLOWED_FIELDS);
    const [updated] = await AdminProfile.update(updateData, { where: { admin_id: req.user.id } });
    if (!updated) return res.status(404).json({ success: false, message: "No profile found." });

    const updatedData = await AdminProfile.findOne({ where: { admin_id: req.user.id } });
    return res.status(200).json({ success: true, data: formatProfile(updatedData) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const deleteAdminProfile = async (req, res) => {
  try {
    const deleted = await AdminProfile.destroy({ where: { admin_id: req.user.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "No profile found." });
    return res.status(200).json({ success: true, message: "Admin profile deleted" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// ─── New: Profile Image Controllers ─────────────────────────────────────────

// Helper to delete a file from disk safely
const deleteFileFromDisk = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error("Failed to delete file:", filePath, e);
    }
  }
};

// Upload / Change profile image
// POST /api/admin/profile/image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const { originalname, size, mimetype, path: filePath, filename } = req.file;
    const ext = path.extname(originalname).replace(".", ""); // e.g. "jpg"
    const normalizedPath = filePath.replace(/\\/g, "/");

    // If an image already exists for this admin, delete old file + record
    const existing = await AdminProfileImage.findOne({
      where: { admin_id: req.user.id },
    });

    if (existing) {
      deleteFileFromDisk(existing.file_path);
      await existing.destroy();
    }

    // Save new record
    const record = await AdminProfileImage.create({
      admin_id: req.user.id,
      file_name: filename,
      file_size: size,
      file_type: mimetype,         // e.g. "image/jpeg"
      file_path: normalizedPath,
    });

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      data: {
        id: record.id,
        file_name: record.file_name,
        file_size: record.file_size,
        file_type: record.file_type,
        file_path: record.file_path,
        image_url: `${req.protocol}://${req.get("host")}/${normalizedPath}`,
        uploaded_at: record.uploaded_at,
      },
    });
  } catch (error) {
    console.error(error);
    if (req.file) deleteFileFromDisk(req.file.path);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Get
export const viewProfileImage = async (req, res) => {
  try {
    const record = await AdminProfileImage.findOne({
      where: { admin_id: req.user.id },
    });

    if (!record) {
      return res.status(404).json({ success: false, message: "No profile image found." });
    }

    const absolutePath = path.resolve(record.file_path);

    if (!fs.existsSync(absolutePath)) {
      // Stale DB record — clean it up
      await record.destroy();
      return res.status(404).json({ success: false, message: "Image file not found on server." });
    }

    // Streams the image directly — browser renders it
    return res.sendFile(absolutePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export const getProfileImageMeta = async (req, res) => {
  try {
    const record = await AdminProfileImage.findOne({
      where: { admin_id: req.user.id },
    });

    if (!record) {
      return res.status(404).json({ success: false, message: "No profile image found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: record.id,
        file_name: record.file_name,
        file_size: record.file_size,
        file_type: record.file_type,
        file_path: record.file_path,
        image_url: `${req.protocol}://${req.get("host")}/${record.file_path}`,
        uploaded_at: record.uploaded_at,
        updated_at: record.updated_at,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// Delete
export const deleteProfileImage = async (req, res) => {
  try {
    const record = await AdminProfileImage.findOne({
      where: { admin_id: req.user.id },
    });

    if (!record) {
      return res.status(404).json({ success: false, message: "No profile image to delete." });
    }

    deleteFileFromDisk(record.file_path);
    await record.destroy();

    return res.status(200).json({ success: true, message: "Profile image deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};