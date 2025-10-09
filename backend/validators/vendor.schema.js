import Joi from "joi";

export const createVendorSchema = Joi.object({
  type: Joi.string()
    .valid("Company", "Freelance", "In-House")
    .required()
    .messages({
      "any.required": "Vendor type is required",
      "any.only": "Type must be one of 'Company', 'Freelance', or 'In-House'",
    }),

  company_name: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Company name must be a string",
  }),

  legal_entity: Joi.string().trim().required().messages({
    "any.required": "Legal entity is required",
    "string.base": "Legal entity must be a string",
  }),

  country: Joi.string().trim().required().messages({
    "any.required": "Country is required",
    "string.base": "Country must be a string",
  }),

  state_region: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "State / Region must be a string",
  }),

  city: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "City must be a string",
  }),

  postal_code: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Postal code must be a string",
  }),

  address: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Address must be a string",
  }),

  pan_tax_number: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "PAN / Tax number must be a string",
  }),

  gstin_vat_number: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "GSTIN / VAT number must be a string",
  }),

  website: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Website must be a string",
  }),

  note: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Note must be a string",
  }),

  can_login: Joi.boolean().required().messages({
    "any.required": "Can login field is required",
    "boolean.base": "Can login must be true or false",
  }),

  assignable_to_jobs: Joi.boolean().optional().default(true).messages({
    "boolean.base": "Assignable to jobs must be true or false",
  }),

  finances_visible: Joi.boolean().optional().default(true).messages({
    "boolean.base": "Finances visible must be true or false",
  }),

  // Primary user details
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

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone must be between 7 and 15 digits",
    }),

  zoom_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Zoom ID must be a string",
  }),

  teams_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Teams ID must be a string",
  }),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional()
    .allow(null, "")
    .messages({
      "any.only": "Gender must be Male, Female, or Other",
    }),

  nationality: Joi.string().trim().required().messages({
    "any.required": "Nationality is required",
    "string.base": "Nationality must be a string",
  }),
});

export const updateVendorSchema = Joi.object({
  type: Joi.string()
    .valid("Company", "Freelance", "In-House")
    .optional()
    .messages({
      "any.only": "Type must be one of 'Company', 'Freelance', or 'In-House'",
    }),

  company_name: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Company name must be a string",
  }),

  legal_entity: Joi.string().trim().optional().messages({
    "string.base": "Legal entity must be a string",
  }),

  country: Joi.string().trim().optional().messages({
    "string.base": "Country must be a string",
  }),

  state_region: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "State / Region must be a string",
  }),

  city: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "City must be a string",
  }),

  postal_code: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Postal code must be a string",
  }),

  address: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Address must be a string",
  }),

  pan_tax_number: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "PAN / Tax number must be a string",
  }),

  gstin_vat_number: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "GSTIN / VAT number must be a string",
  }),

  website: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Website must be a string",
  }),

  note: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Note must be a string",
  }),

  can_login: Joi.boolean().optional().messages({
    "boolean.base": "Can login must be true or false",
  }),

  assignable_to_jobs: Joi.boolean().optional().messages({
    "boolean.base": "Assignable to jobs must be true or false",
  }),

  finances_visible: Joi.boolean().optional().messages({
    "boolean.base": "Finances visible must be true or false",
  }),

  first_name: Joi.string().trim().optional().messages({
    "string.base": "Primary user's first name must be a string",
  }),

  last_name: Joi.string().trim().optional().messages({
    "string.base": "Primary user's last name must be a string",
  }),
  email: Joi.string().email().optional().messages({
    "string.base": "Primary user's email must be a valid email address",
  }),

  timezone: Joi.string().trim().optional().messages({
    "string.base": "Timezone must be a string",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone must be between 7 and 15 digits",
    }),

  zoom_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Zoom ID must be a string",
  }),

  teams_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Teams ID must be a string",
  }),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional()
    .allow(null, "")
    .messages({
      "any.only": "Gender must be Male, Female, or Other",
    }),

  nationality: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Nationality must be a string",
  }),
});

export const getVendorSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required in URL params",
    "number.base": "Vendor ID must be a number",
    "number.integer": "Vendor ID must be an integer",
    "number.positive": "Vendor ID must be a positive number",
  }),
});

export const deleteVendorSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required in URL params",
    "number.base": "Vendor ID must be a number",
    "number.integer": "Vendor ID must be an integer",
    "number.positive": "Vendor ID must be a positive number",
  }),
});
