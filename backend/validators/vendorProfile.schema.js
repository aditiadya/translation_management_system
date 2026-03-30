import Joi from "joi";

export const createVendorProfileSchema = Joi.object({
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  teams_id: Joi.string().max(128).allow(null, "").optional(),
  zoom_id: Joi.string().max(128).allow(null, "").optional(),
  language_email: Joi.string().max(64).allow(null, "").optional(),
});

export const updateVendorProfileSchema = Joi.object({
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  teams_id: Joi.string().max(128).allow(null, "").optional(),
  zoom_id: Joi.string().max(128).allow(null, "").optional(),
  language_email: Joi.string().max(64).allow(null, "").optional(),
}).min(1);
