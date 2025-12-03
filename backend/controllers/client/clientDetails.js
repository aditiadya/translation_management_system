import crypto from "crypto";
import db from "../../models/index.js";
const { AdminAuth, ClientDetails, ClientPrimaryUserDetails } = db;
import { pickAllowed } from "../../utils/pickAllowed.js";

const CLIENT_ALLOWED_FIELDS = [
  "type",
  "company_name",
  "legal_entity",
  "status",
  "country",
  "state_region",
  "city",
  "postal_code",
  "address",
  "pan_tax_number",
  "gstin_vat_number",
  "website",
  "note",
  "first_name",
  "last_name",
  "email",
  "timezone",
  "phone",
  "zoom_id",
  "teams_id",
  "gender",
  "nationality",
  "can_login",
];

const toClientError = (error) => {
  if (error?.name === "SequelizeUniqueConstraintError") {
    return {
      code: 400,
      body: { success: false, message: "Email already exists" },
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
    body: { success: false, message: "Server error" },
  };
};

// Add
export const createClient = async (req, res) => {
  const adminId = req.user.id;
  const data = pickAllowed(req.body, CLIENT_ALLOWED_FIELDS);

  const transaction = await db.sequelize.transaction();

  try {
    const activationToken = data.can_login
      ? crypto.randomBytes(32).toString("hex")
      : null;

    const clientAuth = await AdminAuth.create(
      {
        email: data.email,
        activation_token: activationToken,
      },
      { transaction }
    );

    const clientDetails = await ClientDetails.create(
      {
        auth_id: clientAuth.id,
        admin_id: adminId,
        type: data.type,
        company_name: data.company_name,
        legal_entity: data.legal_entity,
        status: data.status,
        country: data.country,
        state_region: data.state_region,
        city: data.city,
        postal_code: data.postal_code,
        address: data.address,
        pan_tax_number: data.pan_tax_number,
        gstin_vat_number: data.gstin_vat_number,
        website: data.website,
        note: data.note,
        can_login: data.can_login,
      },
      { transaction }
    );

    await ClientPrimaryUserDetails.create(
      {
        client_id: clientDetails.id,
        first_name: data.first_name,
        last_name: data.last_name,
        timezone: data.timezone,
        phone: data.phone,
        zoom_id: data.zoom_id,
        teams_id: data.teams_id,
        gender: data.gender?.trim() || null,
        nationality: data.nationality,
      },
      { transaction }
    );

    await transaction.commit();

    let activationLink = null;
    if (data.can_login) {
      activationLink = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/activate/${activationToken}`;
    }

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      activationLink,
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);

    const errorResponse = toClientError(err);
    return res.status(errorResponse.code).json(errorResponse.body);
  }
};

// Update
export const updateClient = async (req, res) => {
  const clientId = req.params.id;
  const adminId = req.user.id;

  console.log("Request body:", req.body);

  try {
    const client = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
    });

    console.log("Fetched client:", client?.dataValues);

    if (!client) {
      console.log("Client not found!");
      return res
        .status(404)
        .json({ success: false, message: "Client not found." });
    }

    if (req.body.email) {
      const auth = await AdminAuth.findByPk(client.auth_id);
      console.log("Fetched auth record before update:", auth?.dataValues);

      if (auth) {
        auth.email = req.body.email;
        await auth.save();
        console.log("Updated auth record:", auth.dataValues);
      }
    }

    const clientFields = [
      "type",
      "company_name",
      "legal_entity",
      "status",
      "country",
      "state_region",
      "city",
      "postal_code",
      "address",
      "pan_tax_number",
      "gstin_vat_number",
      "website",
      "note",
      "can_login",
    ];

    clientFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        client[field] = req.body[field];
      }
    });

    await client.save();
    console.log("Updated client record:", client.dataValues);

    let primaryUser = await ClientPrimaryUserDetails.findOne({
      where: { client_id: clientId },
    });

    console.log("Fetched primary user before update:", primaryUser?.dataValues);

    const primaryUserFields = [
      "first_name",
      "last_name",
      "timezone",
      "phone",
      "zoom_id",
      "teams_id",
      "gender",
      "nationality",
    ];

    if (primaryUser) {
      const clean = (v) => (v === "" ? null : v);
      primaryUserFields.forEach((field) => {
        if (req.body.hasOwnProperty(field)) {
          primaryUser[field] = clean(req.body[field]);
        }
      });

      await primaryUser.save();
      console.log("Updated primary user record:", primaryUser.dataValues);
    } else {
      const newPrimaryUserData = { client_id: clientId };
      primaryUserFields.forEach((field) => {
        if (req.body.hasOwnProperty(field)) {
          newPrimaryUserData[field] = req.body[field];
        }
      });

      primaryUser = await ClientPrimaryUserDetails.create(newPrimaryUserData);
      console.log("Created new primary user:", primaryUser.dataValues);
    }

    const updatedClient = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: ClientPrimaryUserDetails, as: "primary_user" },
      ],
    });

    console.log("Final updatedClient fetched:", updatedClient?.dataValues);

    return res.status(200).json({ success: true, data: updatedClient });
  } catch (error) {
    console.error("UPDATE CLIENT ERROR:", error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  const clientId = req.params.id;
  const adminId = req.user.id;

  try {
    const client = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: ClientPrimaryUserDetails, as: "primary_user" },
      ],
    });

    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "No client found." });

    return res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};

// Get all clients
export const getAllClients = async (req, res) => {
  const adminId = req.user.id;

  try {
    const clients = await ClientDetails.findAll({
      where: { admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: ClientPrimaryUserDetails, as: "primary_user" },
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json({ success: true, data: clients });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete
export const deleteClient = async (req, res) => {
  const clientId = req.params.id;
  const adminId = req.user.id;

  try {
    const client = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
    });

    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "No client found." });

    await ClientPrimaryUserDetails.destroy({ where: { client_id: clientId } });

    await AdminAuth.destroy({ where: { id: client.auth_id } });

    await ClientDetails.destroy({ where: { id: clientId } });

    return res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    const err = toClientError(error);
    return res.status(err.code).json(err.body);
  }
};