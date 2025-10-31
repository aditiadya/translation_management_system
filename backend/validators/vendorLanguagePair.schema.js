import Joi from "joi";

// Create 
export const createVendorLanguagePairSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.positive": "Vendor ID must be a positive number",
  }),
  language_pair_id: Joi.number().integer().positive().required().messages({
    "any.required": "Language pair ID is required",
    "number.base": "Language pair ID must be a number",
    "number.positive": "Language pair ID must be a positive number",
  }),
});

// Update
export const updateVendorLanguagePairSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor language pair ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
  vendor_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vendor ID must be a number",
  }),
  language_pair_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Language pair ID must be a number",
  }),
})
  .min(2)
  .messages({
    "object.min": "Request must contain vendor language pair ID and at least one field to update.",
  });

// Get
export const getVendorLanguagePairSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor language pair ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
});

// Delete
export const deleteVendorLanguagePairSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor language pair ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
});

// Get All
export const getAllVendorLanguagePairsSchema = Joi.object({
  query: Joi.object({
    vendor_id: Joi.number().integer().positive().optional().messages({
      "number.base": "Vendor ID must be a number",
    }),
    language_pair_id: Joi.number().integer().positive().optional().messages({
      "number.base": "Language pair ID must be a number",
    }),
  }),
});