import Joi from "joi";

// Create 
export const createVendorServiceSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.positive": "Vendor ID must be a positive number",
  }),
  service_id: Joi.number().integer().positive().required().messages({
    "any.required": "Service ID is required",
    "number.base": "Service ID must be a number",
    "number.positive": "Service ID must be a positive number",
  }),
});

// Update
export const updateVendorServiceSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor service ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
  vendor_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Vendor ID must be a number",
  }),
  service_id: Joi.number().integer().positive().optional().messages({
    "number.base": "Service ID must be a number",
  }),
})
  .min(2)
  .messages({
    "object.min": "Request must contain vendor service ID and at least one field to update.",
  });

// Get
export const getVendorServiceSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor service ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
});

// Delete
export const deleteVendorServiceSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor service ID is required in URL params",
      "number.base": "ID must be a number",
    }),
  }),
});

// Get All
export const getAllVendorServicesSchema = Joi.object({
  query: Joi.object({
    vendor_id: Joi.number().integer().positive().optional().messages({
      "number.base": "Vendor ID must be a number",
    }),
    service_id: Joi.number().integer().positive().optional().messages({
      "number.base": "Service ID must be a number",
    }),
  }),
});

// Get all for a particular vendor
export const getVendorServicesForVendorSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor ID is required in URL params",
      "number.base": "Vendor ID must be a number",
      "number.positive": "Vendor ID must be a positive number",
    }),
  }),
});