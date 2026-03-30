import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";
import fs from "fs";
import path from "path";

const { VendorProfile, VendorDetails, VendorPrimaryUserDetails, VendorProfileImage, AdminAuth } = db;

const ALLOWED_FIELDS = ["gender", "teams_id", "zoom_id", "language_email"];

const buildVendorProfileResponse = (vendorProfile, vendor, primaryUser, auth) => {
  const baseProfile = vendorProfile ? vendorProfile.toJSON() : {};
  const vendorData = vendor ? vendor.toJSON() : {};
  const primary = primaryUser || vendorData.primary_users || {};
  const authData = auth ? auth.toJSON() : {};

  return {
    ...baseProfile,
    first_name: primary.first_name || "",
    last_name: primary.last_name || "",
    gender: primary.gender || baseProfile.gender || "",
    phone: primary.phone || "",
    teams_id: primary.teams_id || baseProfile.teams_id || "",
    zoom_id: primary.zoom_id || baseProfile.zoom_id || "",
    language_email: primary.language_email || baseProfile.language_email || "",
    timezone: primary.timezone || vendorData.time_zone || vendorData.timezone || "",
    username: authData.username || authData.email || "",
    email: authData.email || "",
    vendor_details: vendorData,
    primary_users: primary,
  };
};

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return { code: 400, body: { success: false, message: "Duplicate entry not allowed" } };
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

  return { code: 500, body: { success: false, message: "Something went wrong" } };
};

const formatProfile = (profile) => {
  if (!profile) return null;
  const json = profile.toJSON();
  if (json.gender) {
    json.gender = json.gender.charAt(0).toUpperCase() + json.gender.slice(1);
  }
  return json;
};

const getVendorId = async (authId) => {
  const vendor = await VendorDetails.findOne({ where: { auth_id: authId } });
  if (!vendor) return null;
  return vendor.id;
};

export const addVendorProfile = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) {
      return res.status(403).json({ success: false, message: "Vendor record not found" });
    }

    const profileExists = await VendorProfile.findOne({ where: { vendor_id: vendorId } });
    if (profileExists) {
      return res.status(400).json({ success: false, message: "Profile already exists" });
    }

    const profileData = pickAllowed(req.body, ALLOWED_FIELDS);
    profileData.vendor_id = vendorId;

    const newProfile = await VendorProfile.create(profileData);
    return res.status(201).json({ success: true, data: formatProfile(newProfile) });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const getVendorProfile = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) {
      return res.status(403).json({ success: false, message: "Vendor record not found" });
    }

    // Fetch vendor details and related records.
    const vendor = await VendorDetails.findOne({
      where: { id: vendorId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email", "username"] },
        { model: VendorPrimaryUserDetails, as: "primary_users" },
      ],
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor details not found." });
    }

    const profile = await VendorProfile.findOne({ where: { vendor_id: vendorId } });

    const primary = vendor.primary_users?.[0] || null;
    const auth = vendor.auth || null;
    const data = buildVendorProfileResponse(profile, vendor, primary, auth);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) {
      return res.status(403).json({ success: false, message: "Vendor record not found" });
    }

    const updateData = pickAllowed(req.body, ALLOWED_FIELDS);

    let profile = await VendorProfile.findOne({ where: { vendor_id: vendorId } });

    if (profile) {
      await profile.update(updateData);
    } else {
      profile = await VendorProfile.create({ vendor_id: vendorId, ...updateData });
    }

    const vendor = await VendorDetails.findOne({
      where: { id: vendorId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email", "username"] },
        { model: VendorPrimaryUserDetails, as: "primary_users" },
      ],
    });

    const primary = vendor?.primary_users?.[0] || null;
    const auth = vendor?.auth || null;
    const data = buildVendorProfileResponse(profile, vendor, primary, auth);

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

export const deleteVendorProfile = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) {
      return res.status(403).json({ success: false, message: "Vendor record not found" });
    }

    const deleted = await VendorProfile.destroy({ where: { vendor_id: vendorId } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "No profile found." });
    }

    return res.status(200).json({ success: true, message: "Vendor profile deleted" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Image functions (like admin profile image)
const deleteFileFromDisk = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error("Failed to delete file:", filePath, e);
    }
  }
};

export const uploadVendorProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) return res.status(403).json({ success: false, message: "Vendor record not found" });

    const { originalname, size, mimetype, path: filePath, filename } = req.file;
    const normalizedPath = filePath.replace(/\\/g, "/");

    const existing = await VendorProfileImage.findOne({ where: { vendor_id: vendorId } });
    if (existing) {
      deleteFileFromDisk(existing.file_path);
      await existing.destroy();
    }

    const record = await VendorProfileImage.create({
      vendor_id: vendorId,
      file_name: filename,
      file_size: size,
      file_type: mimetype,
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
        image_url: `${req.protocol}://${req.get("host")}/${record.file_path}`,
        uploaded_at: record.uploaded_at,
      },
    });
  } catch (error) {
    console.error(error);
    if (req.file) deleteFileFromDisk(req.file.path);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export const viewVendorProfileImage = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) return res.status(403).json({ success: false, message: "Vendor record not found" });

    const record = await VendorProfileImage.findOne({ where: { vendor_id: vendorId } });
    if (!record) {
      return res.status(404).json({ success: false, message: "No profile image found." });
    }

    const absolutePath = path.resolve(record.file_path);
    if (!fs.existsSync(absolutePath)) {
      await record.destroy();
      return res.status(404).json({ success: false, message: "Image file not found on server." });
    }
    return res.sendFile(absolutePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

export const getVendorProfileImageMeta = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) return res.status(403).json({ success: false, message: "Vendor record not found" });

    const record = await VendorProfileImage.findOne({ where: { vendor_id: vendorId } });
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

export const deleteVendorProfileImage = async (req, res) => {
  try {
    const vendorId = await getVendorId(req.user.id);
    if (!vendorId) return res.status(403).json({ success: false, message: "Vendor record not found" });

    const record = await VendorProfileImage.findOne({ where: { vendor_id: vendorId } });
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

