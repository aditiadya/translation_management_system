import Joi from "joi";

// Get
export const getVendorSettingsSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "Vendor ID is required in URL params",
      "number.base": "Vendor ID must be a number",
      "number.integer": "Vendor ID must be an integer",
      "number.positive": "Vendor ID must be a positive number",
    }),
  }),
});

// Update
export const updateVendorSettingsSchema = Joi.object({
  works_with_all_services: Joi.boolean().optional(),
  works_with_all_language_pairs: Joi.boolean().optional(),
  works_with_all_specializations: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update vendor settings",
  });