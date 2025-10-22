import db from "../../models/index.js";
import { pickAllowed } from "../../utils/pickAllowed.js";

const { VendorContactPersons, VendorDetails } = db;

const ALLOWED_FIELDS = [
  "vendor_id",
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

    const vendor = await VendorDetails.findByPk(data.vendor_id);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    const newContact = await VendorContactPersons.create(data);

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
    const { vendor_id } = req.query;
    const where = {};

    if (vendor_id) where.vendor_id = vendor_id;

    const persons = await VendorContactPersons.findAll({
      where,
      include: [
        {
          model: VendorDetails,
          as: "vendor",
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

    const person = await VendorContactPersons.findByPk(id, {
      include: [
        {
          model: VendorDetails,
          as: "vendor",
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
    const person = await VendorContactPersons.findByPk(id);

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
    const person = await VendorContactPersons.findByPk(id);

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