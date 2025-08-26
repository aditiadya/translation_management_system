import Joi from "joi";

export const adminDetailsUpdateSchema = Joi.object({
  account_type: Joi.string().valid("enterprise", "freelance"),
  company_name: Joi.string().max(128).allow("", null),
  country: Joi.string().max(100),
  time_zone: Joi.string().max(64),
  first_name: Joi.string().max(64),
  last_name: Joi.string().max(64),
  username: Joi.string().min(3).max(64),
  phone: Joi.string().pattern(/^\+?[0-9\-]{7,20}$/),
}).min(1); 
