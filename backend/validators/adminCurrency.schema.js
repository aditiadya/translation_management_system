import Joi from "joi";

export const createAdminCurrencySchema = Joi.object({
  currencyId: Joi.number().integer().required(),
  active_flag: Joi.boolean().optional(),
});

export const updateAdminCurrencySchema = Joi.object({
  currencyId: Joi.number().integer().optional(),
  active_flag: Joi.boolean().optional(),
});
