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

// Add
export const addVendorPaymentMethodSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.integer": "Vendor ID must be an integer",
    "number.positive": "Vendor ID must be a positive number",
  }),
  payment_method: paymentMethodEnum,
  note: Joi.string().trim().optional(),
  active_flag: Joi.boolean().optional(),
  is_default: Joi.boolean().optional(),
  details: Joi.alternatives()
    .conditional("payment_method", [
      { is: "bank_transfer", then: bankTransferDetailsSchema.required() },
      {
        is: Joi.valid("paypal", "payoneer", "skrill"),
        then: emailPaymentDetailsSchema.required(),
      },
      { is: "other", then: otherPaymentDetailsSchema.required() },
    ])
    .required()
    .messages({
      "any.required": "Details are required based on payment method type",
    }),
});

// Update
export const updateVendorPaymentMethodSchema = Joi.object({
  note: Joi.string().trim().optional(),
  active_flag: Joi.boolean().optional(),
  is_default: Joi.boolean().optional(),
  details: Joi.object().optional(),
});

// Get
export const getVendorPaymentMethodsSchema = Joi.object({
  vendor_id: Joi.number().integer().positive().required().messages({
    "any.required": "Vendor ID is required",
    "number.base": "Vendor ID must be a number",
    "number.integer": "Vendor ID must be an integer",
    "number.positive": "Vendor ID must be a positive number",
  }),
});

// Delete
export const deleteVendorPaymentMethodSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Payment method ID is required",
    "number.base": "Payment method ID must be a number",
    "number.integer": "Payment method ID must be an integer",
    "number.positive": "Payment method ID must be a positive number",
  }),
});
