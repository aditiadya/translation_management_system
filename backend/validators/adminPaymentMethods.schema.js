import Joi from "joi";

export const createAdminPaymentMethodSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  payment_type: Joi.string().max(50).required(),
  bank_info: Joi.string().max(255).allow(null, "").optional(),
  description: Joi.string().allow(null, "").optional(),
  active_flag: Joi.boolean().optional(),
});

export const updateAdminPaymentMethodSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  payment_type: Joi.string().max(50).optional(),
  bank_info: Joi.string().max(255).allow(null, "").optional(),
  description: Joi.string().allow(null, "").optional(),
  active_flag: Joi.boolean().optional(),
});
