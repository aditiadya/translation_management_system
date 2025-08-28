import Joi from "joi";

export const createAdminServiceSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  active_flag: Joi.boolean().optional(),
});

export const updateAdminServiceSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  active_flag: Joi.boolean().optional(),
});
