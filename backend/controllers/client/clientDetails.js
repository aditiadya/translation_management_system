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

  try {
    const activationToken = data.can_login
      ? crypto.randomBytes(32).toString("hex")
      : null;

    const clientAuth = await AdminAuth.create({
      email: data.email,
      activation_token: activationToken,
    });

    const clientDetails = await ClientDetails.create({
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
    });

    await ClientPrimaryUserDetails.create({
      client_id: clientDetails.id,
      first_name: data.first_name,
      last_name: data.last_name,
      timezone: data.timezone,
      phone: data.phone,
      zoom_id: data.zoom_id,
      teams_id: data.teams_id,
      gender: data.gender,
      can_login: data.can_login,
    });

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
    console.error(err);
    const errorResponse = toClientError(err);
    return res.status(errorResponse.code).json(errorResponse.body);
  }
};

// Update
// export const updateClient = async (req, res) => {
//   const clientId = req.params.id;
//   const adminId = req.user.id;
//   const data = pickAllowed(req.body, CLIENT_ALLOWED_FIELDS);

//   try {
//     if (data.email) {
//       const client = await ClientDetails.findOne({
//         where: { id: clientId, admin_id: adminId },
//       });

//       if (!client) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Client not found." });
//       }

//       await AdminAuth.update(
//         { email: data.email },
//         { where: { id: client.auth_id } }
//       );
//     }

//     const [updated] = await ClientDetails.update(data, {
//       where: { id: clientId, admin_id: adminId },
//     });

//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Client not found." });
//     }

//     await ClientPrimaryUserDetails.update(data, {
//       where: { client_id: clientId },
//     });

//     const updatedClient = await ClientDetails.findOne({
//       where: { id: clientId, admin_id: adminId },
//       include: [
//         { model: AdminAuth, as: "auth", attributes: ["email"] },
//         { model: ClientPrimaryUserDetails, as: "primary_users" }, // match your alias
//       ],
//     });

//     return res.status(200).json({ success: true, data: updatedClient });
//   } catch (error) {
//     console.error(error);
//     const err = toClientError(error);
//     return res.status(err.code).json(err.body);
//   }
// };


// Get client by ID
export const getClientById = async (req, res) => {
  const clientId = req.params.id;
  const adminId = req.user.id;

  try {
    const client = await ClientDetails.findOne({
      where: { id: clientId, admin_id: adminId },
      include: [
        { model: AdminAuth, as: "auth", attributes: ["email"] },
        { model: ClientPrimaryUserDetails, as: "primary_users" },
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
        { model: ClientPrimaryUserDetails, as: "primary_users" },
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
