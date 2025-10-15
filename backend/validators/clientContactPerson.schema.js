import Joi from "joi";

// Create Contact Person
export const createContactPersonSchema = Joi.object({
  client_id: Joi.number().integer().positive().required().messages({
    "any.required": "Client ID is required",
    "number.base": "Client ID must be a number",
  }),
  first_name: Joi.string().trim().required().messages({
    "any.required": "First name is required",
  }),
  last_name: Joi.string().trim().optional().allow(null, ""),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  gender: Joi.string().valid("Male", "Female", "Other").optional().allow(null, ""),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(null, "").messages({
    "string.pattern.base": "Phone must be between 7 and 15 digits",
  }),
  teams_id: Joi.string().trim().optional().allow(null, ""),
  zoom_id: Joi.string().trim().optional().allow(null, ""),
  position: Joi.string().trim().optional().allow(null, ""),
  notes: Joi.string().trim().optional().allow(null, ""),
  is_active: Joi.boolean().optional(),
  is_invoicing: Joi.boolean().optional(),
});

// Update Contact Person
export const updateContactPersonSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Contact person ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
  // Validate the actual request body directly
  first_name: Joi.string().trim().optional(),
  last_name: Joi.string().trim().optional().allow(null, ""),
  email: Joi.string().email().optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional().allow(null, ""),
  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(null, "").messages({
    "string.pattern.base": "Phone must be between 7 and 15 digits",
  }),
  teams_id: Joi.string().trim().optional().allow(null, ""),
  zoom_id: Joi.string().trim().optional().allow(null, ""),
  position: Joi.string().trim().optional().allow(null, ""),
  notes: Joi.string().trim().optional().allow(null, ""),
  is_active: Joi.boolean().optional(),
  is_invoicing: Joi.boolean().optional(),
}).min(2) // 'params.id' + at least one field in body
  .messages({
    "object.min": "Request must contain contact person ID and at least one field to update.",
  });

// Get Contact Person
export const getContactPersonSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Contact person ID is required in URL params",
    }),
  }),
});

// Delete Contact Person
export const deleteContactPersonSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Contact person ID is required in URL params",
    }),
  }),
});

// Get All Contact Persons
export const getAllContactPersonsSchema = Joi.object({
  query: Joi.object({
    client_id: Joi.number().integer().positive().optional(),
    is_active: Joi.boolean().optional(),
  }),
});