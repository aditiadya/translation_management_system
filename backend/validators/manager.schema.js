import Joi from "joi";

export const createManagerSchema = Joi.object({
  role_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Role ID is required",
      "number.base": "Role ID must be a number",
      "number.integer": "Role ID must be an integer",
      "number.positive": "Role ID must be a positive number",
    }),

  client_pool: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Client pool must be a string",
  }),

  first_name: Joi.string().trim().required().messages({
    "any.required": "First name is required",
    "string.base": "First name must be a string",
  }),

  last_name: Joi.string().trim().required().messages({
    "any.required": "Last name is required",
    "string.base": "Last name must be a string",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").optional().allow(null, "").messages({
    "any.only": "Gender must be Male, Female, or Other",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(null, "").messages({
    "string.pattern.base": "Phone must be between 7 and 15 digits",
  }),

  teams_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Teams ID must be a string",
  }),

  zoom_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Zoom ID must be a string",
  }),

  timezone: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Timezone must be a string",
  }),

  can_login: Joi.boolean().required().messages({
    "any.required": "Can login field is required",
    "boolean.base": "Can login must be true or false",
  }),
});

export const updateManagerSchema = Joi.object({
  role_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Role ID must be a number",
    "number.integer": "Role ID must be an integer",
    "number.positive": "Role ID must be a positive number",
  }),

  client_pool: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Client pool must be a string",
  }),

  first_name: Joi.string().trim().optional().messages({
    "string.base": "First name must be a string",
  }),

  last_name: Joi.string().trim().optional().messages({
    "string.base": "Last name must be a string",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").optional().allow(null, "").messages({
    "any.only": "Gender must be Male, Female, or Other",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address",
  }),

  phone: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow(null, "").messages({
    "string.pattern.base": "Phone must be between 7 and 15 digits",
  }),

  teams_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Teams ID must be a string",
  }),

  zoom_id: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Zoom ID must be a string",
  }),

  timezone: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Timezone must be a string",
  }),

  can_login: Joi.boolean().optional().messages({
    "boolean.base": "Can login must be true or false",
  }),
});

export const getManagerSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Manager ID is required",
    "number.base": "Manager ID must be a number",
    "number.integer": "Manager ID must be an integer",
    "number.positive": "Manager ID must be a positive number",
  }),
});

export const deleteManagerSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Manager ID is required",
    "number.base": "Manager ID must be a number",
    "number.integer": "Manager ID must be an integer",
    "number.positive": "Manager ID must be a positive number",
  }),
});
