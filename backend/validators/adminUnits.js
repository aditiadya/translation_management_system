import Joi from "joi";

export const createAdminUnitSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  active_flag: Joi.boolean().optional(),
  in_use: Joi.boolean().optional(),
  is_word: Joi.boolean().optional(),
});

export const updateAdminUnitSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  active_flag: Joi.boolean().optional(),
  in_use: Joi.boolean().optional(),
  is_word: Joi.boolean().optional(),
});
