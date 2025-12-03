import Joi from "joi";

export const createClientSchema = Joi.object({
  type: Joi.string().valid("Company", "Individual").required().messages({
    "any.required": "Type is required",
    "any.only": "Type must be either 'Company' or 'Individual'",
  }),

  company_name: Joi.string().trim().optional().allow("").messages({
    "string.base": "Company name must be a string",
  }),

  legal_entity: Joi.string().trim().required().messages({
    "any.required": "Legal entity is required",
    "string.base": "Legal entity must be a string",
  }),

  status: Joi.string().trim().required().messages({
    "any.required": "Status is required",
    "string.base": "Status must be a string",
  }),

  country: Joi.string().trim().required().messages({
    "any.required": "Country is required",
    "string.base": "Country must be a string",
  }),

  state_region: Joi.string().trim().optional().allow("").messages({
    "string.base": "State / Region must be a string",
  }),

  city: Joi.string().trim().optional().allow("").messages({
    "string.base": "City must be a string",
  }),

  postal_code: Joi.string().trim().optional().allow("").messages({
    "string.base": "Postal code must be a string",
  }),

  address: Joi.string().trim().optional().allow("").messages({
    "string.base": "Address must be a string",
  }),

  pan_tax_number: Joi.string().trim().optional().allow("").messages({
    "string.base": "PAN / Tax number must be a string",
  }),

  gstin_vat_number: Joi.string().trim().optional().allow("").messages({
    "string.base": "GSTIN / VAT number must be a string",
  }),

  website: Joi.string().trim().optional().allow("").messages({
    "string.base": "Website must be a string",
  }),

  note: Joi.string().trim().optional().allow("").messages({
    "string.base": "Note must be a string",
  }),

  can_login: Joi.boolean().required().messages({
    "any.required": "Can login field is required",
    "boolean.base": "Can login must be true or false",
  }),

  first_name: Joi.string().trim().required().messages({
    "any.required": "Primary user's first name is required",
    "string.base": "First name must be a string",
  }),

  last_name: Joi.string().trim().required().messages({
    "any.required": "Primary user's last name is required",
    "string.base": "Last name must be a string",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Primary user's email is required",
    "string.email": "Email must be a valid email address",
  }),

  timezone: Joi.string().trim().required().messages({
    "any.required": "Primary user's timezone is required",
    "string.base": "Timezone must be a string",
  }),

  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow("").messages({
    "string.pattern.base": "Phone must be between 7 and 15 digits",
  }),

  zoom_id: Joi.string().trim().optional().allow("").messages({
    "string.base": "Zoom ID must be a string",
  }),

  teams_id: Joi.string().trim().optional().allow("").messages({
    "string.base": "Teams ID must be a string",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").optional().allow("").messages({
    "any.only": "Gender must be Male, Female, or Other",
  }),

  nationality: Joi.string().trim().optional().allow("").messages({
    "string.base": "Nationality must be a string",
  }),
});


export const updateClientSchema = Joi.object({
  type: Joi.string()
    .valid("Company", "Individual")
    .optional().allow("")
    .messages({
      "any.only": "Type must be either 'Company' or 'Individual'",
    }),

  company_name: Joi.string().trim().optional().allow("").messages({
    "string.base": "Company name must be a string",
  }),

  legal_entity: Joi.string().trim().optional().allow("").messages({
    "string.base": "Legal entity must be a string",
  }),

  status: Joi.string().trim().optional().allow("").messages({
    "string.base": "Status must be a string",
  }),

  country: Joi.string().trim().optional().allow("").messages({
    "string.base": "Country must be a string",
  }),

  state_region: Joi.string().trim().optional().allow("").messages({
    "string.base": "State / Region must be a string",
  }),

  city: Joi.string().trim().optional().allow("").messages({
    "string.base": "City must be a string",
  }),

  postal_code: Joi.string().trim().optional().allow("").messages({
    "string.base": "Postal code must be a string",
  }),

  address: Joi.string().trim().optional().allow("").messages({
    "string.base": "Address must be a string",
  }),

  pan_tax_number: Joi.string().trim().optional().allow("").messages({
    "string.base": "PAN / Tax number must be a string",
  }),

  gstin_vat_number: Joi.string().trim().optional().allow("").messages({
    "string.base": "GSTIN / VAT number must be a string",
  }),

  website: Joi.string().trim().optional().allow("").messages({
    "string.base": "Website must be a string",
  }),

  note: Joi.string().trim().optional().allow("").messages({
    "string.base": "Note must be a string",
  }),

  can_login: Joi.boolean().optional().messages({
    "boolean.base": "Can login must be true or false",
  }),

  first_name: Joi.string().trim().optional().allow("").messages({
    "string.base": "Primary user's first name must be a string",
  }),

  last_name: Joi.string().trim().optional().allow("").messages({
    "string.base": "Primary user's last name must be a string",
  }),

  email: Joi.string().email().optional().allow("").messages({
    "string.email": "Email must be a valid email address",
  }),

  timezone: Joi.string().trim().optional().allow("").messages({
    "string.base": "Timezone must be a string",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Phone must be between 7 and 15 digits",
    }),

  zoom_id: Joi.string().trim().optional().allow("").messages({
    "string.base": "Zoom ID must be a string",
  }),

  teams_id: Joi.string().trim().optional().allow("").messages({
    "string.base": "Teams ID must be a string",
  }),

  gender: Joi.string()
    .valid("Male", "Female", "Other", null)
    .optional()
    .allow("")
    .messages({
      "any.only": "Gender must be Male, Female, or Other",
    }),

    nationality: Joi.string().trim().optional().allow("").messages({
    "string.base": "Nationality must be a string",
  }),
});


export const getClientSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Client ID is required in URL params",
    "number.base": "Client ID must be a number",
    "number.integer": "Client ID must be an integer",
    "number.positive": "Client ID must be a positive number",
  }),
});


export const deleteClientSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Client ID is required in URL params",
    "number.base": "Client ID must be a number",
    "number.integer": "Client ID must be an integer",
    "number.positive": "Client ID must be a positive number",
  }),
});