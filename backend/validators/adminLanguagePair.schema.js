import Joi from "joi";

export const createAdminLanguagePairSchema = Joi.object({
  source_language_id: Joi.number().integer().required(),
  target_language_id: Joi.number().integer().required(),
  active_flag: Joi.boolean().optional(),
}).custom((value, helpers) => {
  if (value.source_language_id === value.target_language_id) {
    return helpers.error("any.invalid", { message: "Source and target language cannot be the same" });
  }
  return value;
});

export const updateAdminLanguagePairSchema = Joi.object({
  source_language_id: Joi.number().integer().optional(),
  target_language_id: Joi.number().integer().optional(),
  active_flag: Joi.boolean().optional(),
}).custom((value, helpers) => {
  if (
    value.source_language_id !== undefined &&
    value.target_language_id !== undefined &&
    value.source_language_id === value.target_language_id
  ) {
    return helpers.error("any.invalid", { message: "Source and target language cannot be the same" });
  }
  return value;
});
