import Joi from "joi";

export const createAdminSpecializationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  active_flag: Joi.boolean().optional(),
});

export const updateAdminSpecializationSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  active_flag: Joi.boolean().optional(),
});
