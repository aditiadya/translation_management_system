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

// Get all language pairs for a particular vendor
export const getVendorLanguagePairsForVendorSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor ID is required in URL params",
      "number.base": "Vendor ID must be a number",
      "number.positive": "Vendor ID must be a positive number",
    }),
  }),
});

// Bulk create vendor language pairs
export const bulkCreateVendorLanguagePairSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.positive": "Vendor ID must be a positive number",
  }),
  language_pair_ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      "any.required": "Language pair IDs are required",
      "array.base": "Language pair IDs must be an array",
      "array.min": "At least one language pair ID is required",
      "number.base": "Each language pair ID must be a number",
      "number.positive": "Each language pair ID must be a positive number",
    }),
});

// Bulk delete vendor language pairs
export const bulkDeleteVendorLanguagePairSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.positive": "Vendor ID must be a positive number",
  }),
  language_pair_ids: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      "any.required": "Language pair IDs are required",
      "array.base": "Language pair IDs must be an array",
      "array.min": "At least one language pair ID is required",
      "number.base": "Each language pair ID must be a number",
      "number.positive": "Each language pair ID must be a positive number",
    }),
});

// Get admin language pairs for vendor selection
export const getAdminLanguagePairsForVendorSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor ID is required in URL params",
      "number.base": "Vendor ID must be a number",
      "number.positive": "Vendor ID must be a positive number",
    }),
  }),
});

// Initialize all language pairs for vendor
export const initializeVendorLanguagePairsSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.integer": "Vendor ID must be an integer",
    "number.positive": "Vendor ID must be a positive number",
  }),
});
