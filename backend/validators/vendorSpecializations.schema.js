import Joi from "joi";

// Create
export const createVendorSpecializationSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.positive": "Vendor ID must be a positive number",
  }),
  specialization_id: Joi.number().integer().positive().required().messages({
    "any.required": "Specialization ID is required",
    "number.base": "Specialization ID must be a number",
    "number.positive": "Specialization ID must be a positive number",
  }),
});

// Update
export const updateVendorSpecializationSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor specialization ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
  vendor_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vendor ID must be a number",
  }),
  specialization_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Specialization ID must be a number",
  }),
})
  .min(2)
  .messages({
    "object.min":
      "Request must contain vendor specialization ID and at least one field to update.",
  });

// Get
export const getVendorSpecializationSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required":
        "Vendor specialization ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
});

// Delete
export const deleteVendorSpecializationSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required":
        "Vendor specialization ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
});

// Get All
export const getAllVendorSpecializationsSchema = Joi.object({
  query: Joi.object({
    vendor_id: Joi.number().integer().positive().optional().messages({
      "number.base": "Vendor ID must be a number",
    }),
    specialization_id: Joi.number().integer().positive().optional().messages({
      "number.base": "Specialization ID must be a number",
    }),
  }),
});
