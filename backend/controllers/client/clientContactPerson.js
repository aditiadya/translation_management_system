import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { ClientContactPersons, ClientDetails } = db;

const ALLOWED_FIELDS = [
  "client_id",
  "first_name",
  "last_name",
  "email",
  "gender",
  "phone",
  "teams_id",
  "zoom_id",
  "position",
  "notes",
  "is_active",
  "is_invoicing",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Duplicate entry detected" },
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
  console.error("Unhandled error:", error);
  return { code: 500, body: { success: false, message: "Server error" } };
};

// Add
export const addContactPerson = async (req, res) => {
  try {
    const data = pickAllowed(req.body, ALLOWED_FIELDS);

    const client = await ClientDetails.findByPk(data.client_id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    const newContact = await ClientContactPersons.create(data);

    return res.status(201).json({
      success: true,
      message: "Contact person added successfully",
      data: newContact,
    });
  } catch (error) {
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get All
export const getAllContactPersons = async (req, res) => {
  try {
    const { client_id } = req.query;
    const where = {};

    if (client_id) where.client_id = client_id;

    const persons = await ClientContactPersons.findAll({
      where,
      include: [
        {
          model: ClientDetails,
          as: "client",
          attributes: ["id", "company_name"],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({ success: true, data: persons });
  } catch (error) {
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get
export const getContactPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await ClientContactPersons.findByPk(id, {
      include: [
        {
          model: ClientDetails,
          as: "client",
          attributes: ["id", "company_name"],
        },
      ],
    });

    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Contact person not found" });
    }

    return res.status(200).json({ success: true, data: person });
  } catch (error) {
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Update
export const updateContactPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await ClientContactPersons.findByPk(id);

    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Contact person not found" });
    }

    const data = pickAllowed(req.body, ALLOWED_FIELDS);
    console.log("Data to update:", data);

    console.log("Headers:", req.headers);
    console.log("Request body:", req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }
    await person.update(data);

    return res.status(200).json({
      success: true,
      message: "Contact person updated successfully",
      data: person,
    });
  } catch (error) {
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Delete
export const deleteContactPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await ClientContactPersons.findByPk(id);

    if (!person) {
      return res
        .status(404)
        .json({ success: false, message: "Contact person not found" });
    }

    await person.destroy();

    return res.status(200).json({
      success: true,
      message: "Contact person deleted successfully",
    });
  } catch (error) {
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};