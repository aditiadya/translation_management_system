import Joi from "joi";

const paymentMethodEnum = Joi.string()
  .valid("bank_transfer", "paypal", "payoneer", "skrill", "other")
  .required()
  .messages({
    "any.required": "Payment method is required",
    "any.only":
      "Payment method must be one of bank_transfer, paypal, payoneer, skrill, or other",
  });

// Bank Transfer
const bankTransferDetailsSchema = Joi.object({
  payment_method_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Payment method name is required",
  }),
  beneficiary_name: Joi.string().trim().max(100).optional(),
  beneficiary_address: Joi.string().trim().optional(),
  bank_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Bank name is required",
  }),
  account_number: Joi.string().trim().max(100).optional(),
  ifsc_code: Joi.string().trim().max(50).optional(),
  swift: Joi.string().trim().max(50).optional(),
  iban: Joi.string().trim().max(100).optional(),
  sort_code: Joi.string().trim().max(50).optional(),
  bank_address: Joi.string().trim().optional(),
  country: Joi.string().trim().max(100).required().messages({
    "any.required": "Country is required",
  }),
  state_region: Joi.string().trim().max(100).optional(),
  city: Joi.string().trim().max(100).optional(),
  postal_code: Joi.string().trim().max(50).optional(),
});

// PayPal / Payoneer / Skrill
const emailPaymentDetailsSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required for this payment method",
    "string.email": "Invalid email address",
  }),
});

// Other
const otherPaymentDetailsSchema = Joi.object({
  payment_method_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Payment method name is required for 'other' type",
  }),
});

// ---------------------- CREATE SCHEMA ----------------------
export const createPaymentMethodSchema = Joi.object({
  payment_method: paymentMethodEnum,
  note: Joi.string().trim().optional(),
  active_flag: Joi.boolean().optional(),
  details: Joi.alternatives()
    .conditional("payment_method", [
      { is: "bank_transfer", then: bankTransferDetailsSchema.required() },
      {
        is: Joi.valid("paypal", "payoneer", "skrill"),
        then: emailPaymentDetailsSchema.required(),
      },
      { is: "other", then: otherPaymentDetailsSchema.required() },
    ])
    .optional(),
});

// ---------------------- UPDATE SCHEMA ----------------------
export const updatePaymentMethodSchema = Joi.object({
  note: Joi.string().trim().optional(),
  active_flag: Joi.boolean().optional(),
  details: Joi.object().optional(),
});

// ---------------------- GET SCHEMA ----------------------
export const getPaymentMethodSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Payment method ID is required",
    "number.base": "Payment method ID must be a number",
    "number.integer": "Payment method ID must be an integer",
    "number.positive": "Payment method ID must be a positive number",
  }),
});

// ---------------------- DELETE SCHEMA ----------------------
export const deletePaymentMethodSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Payment method ID is required",
    "number.base": "Payment method ID must be a number",
    "number.integer": "Payment method ID must be an integer",
    "number.positive": "Payment method ID must be a positive number",
  }),
});