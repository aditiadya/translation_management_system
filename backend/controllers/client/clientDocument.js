import fs from "fs";
import path from "path";
import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { ClientDocuments, ClientDetails } = db;

const CLIENT_DOCUMENT_ALLOWED_FIELDS = [
  "client_id",
  "document_name",
  "description",
];

const toDocumentError = (error) => {
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

// Add
export const createClientDocument = async (req, res) => {
  const adminId = req.user.id;
  const file = req.file;
  try {
    const data = pickAllowed(req.body, CLIENT_DOCUMENT_ALLOWED_FIELDS);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }
    const client = await ClientDetails.findOne({
      where: { id: data.client_id, admin_id: adminId },
    });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or not associated with this admin",
      });
    }
    const relativePath = path.posix.join("uploads", "client_documents", file.filename);
    const newDocument = await ClientDocuments.create({
      client_id: data.client_id,
      document_name: data.document_name.trim(),
      file_name: file.filename,
      file_size: file.size,
      file_type: file.mimetype,
      file_path: relativePath,
      uploaded_by: adminId,
      description: data.description?.trim() || null,
    });
    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: newDocument,
    });
  } catch (error) {
    console.error("CREATE CLIENT DOCUMENT ERROR:", error);
    const err = toDocumentError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all
export const getAllClientDocuments = async (req, res) => {
  const adminId = req.user.id;
  const { client_id } = req.query;

  try {
    if (!client_id) {
      return res.status(400).json({
        success: false,
        message: "client_id is required",
      });
    }

    const client = await ClientDetails.findOne({
      where: { id: client_id, admin_id: adminId },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or not associated with this admin",
      });
    }

    const documents = await ClientDocuments.findAll({
      where: { client_id },
      order: [["uploaded_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("GET ALL CLIENT DOCUMENTS ERROR:", error);
    const err = toDocumentError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get
export const getClientDocumentById = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const document = await ClientDocuments.findByPk(id, {
      include: [{ model: ClientDetails, as: "client" }],
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (document.client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This document does not belong to your clients.",
      });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("GET CLIENT DOCUMENT BY ID ERROR:", error);
    const err = toDocumentError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update
export const updateClientDocument = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;
  const file = req.file;
  const data = pickAllowed(req.body, ["document_name", "description"]);

  try {
    const document = await ClientDocuments.findByPk(id, {
      include: [{ model: ClientDetails, as: "client" }],
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (document.client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This document does not belong to your clients.",
      });
    }

    if (file) {
      const oldPath = path.resolve(document.file_path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      const relativePath = path.posix.join("uploads", "client_documents", file.filename);
      document.file_name = file.filename;
      document.file_size = file.size;
      document.file_type = file.mimetype;
      document.file_path = relativePath;
    }

    if (data.document_name) document.document_name = data.document_name.trim();
    if (data.description !== undefined) document.description = data.description.trim();

    await document.save();

    return res.status(200).json({
      success: true,
      message: file
        ? "Document and file updated successfully"
        : "Document details updated successfully",
      data: document,
    });
  } catch (error) {
    console.error("UPDATE CLIENT DOCUMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating document",
    });
  }
};

// Delete
export const deleteClientDocument = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  try {
    const document = await ClientDocuments.findByPk(id, {
      include: [{ model: ClientDetails, as: "client" }],
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (document.client.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This document does not belong to your clients.",
      });
    }

    const filePath = path.resolve(document.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.destroy();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CLIENT DOCUMENT ERROR:", error);
    const err = toDocumentError(error);
    return res.status(err.code).json(err.body);
  }
};