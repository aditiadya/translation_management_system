import Joi from "joi";

// Validation for creating a client pool
export const createClientPoolSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required().messages({
    "any.required": "Client pool name is required",
    "string.base": "Client pool name must be a string",
    "string.min": "Client pool name must be at least 2 characters",
    "string.max": "Client pool name must be at most 255 characters",
  }),
  client_ids: Joi.array().items(Joi.number().integer().positive()).optional().messages({
    "array.base": "Client IDs must be an array of numbers",
    "number.base": "Each client ID must be a number",
    "number.integer": "Each client ID must be an integer",
    "number.positive": "Each client ID must be a positive number",
  }),
  manager_ids: Joi.array().items(Joi.number().integer().positive()).optional().messages({
    "array.base": "Manager IDs must be an array of numbers",
    "number.base": "Each manager ID must be a number",
    "number.integer": "Each manager ID must be an integer",
    "number.positive": "Each manager ID must be a positive number",
  }),
});

// Validation for updating a client pool
export const updateClientPoolSchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).optional().messages({
    "string.base": "Client pool name must be a string",
    "string.min": "Client pool name must be at least 2 characters",
    "string.max": "Client pool name must be at most 255 characters",
  }),
  client_ids: Joi.array().items(Joi.number().integer().positive()).optional().messages({
    "array.base": "Client IDs must be an array of numbers",
    "number.base": "Each client ID must be a number",
    "number.integer": "Each client ID must be an integer",
    "number.positive": "Each client ID must be a positive number",
  }),
  manager_ids: Joi.array().items(Joi.number().integer().positive()).optional().messages({
    "array.base": "Manager IDs must be an array of numbers",
    "number.base": "Each manager ID must be a number",
    "number.integer": "Each manager ID must be an integer",
    "number.positive": "Each manager ID must be a positive number",
  }),
});

// Validation for getting a client pool
export const getClientPoolSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Client pool ID is required",
    "number.base": "Client pool ID must be a number",
    "number.integer": "Client pool ID must be an integer",
    "number.positive": "Client pool ID must be a positive number",
  }),
});

// Validation for deleting a client pool
export const deleteClientPoolSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Client pool ID is required",
    "number.base": "Client pool ID must be a number",
    "number.integer": "Client pool ID must be an integer",
    "number.positive": "Client pool ID must be a positive number",
  }),
});