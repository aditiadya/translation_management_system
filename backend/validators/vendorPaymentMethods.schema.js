import Joi from "joi";

const paymentMethodEnum = Joi.string()
  .valid("bank_transfer", "paypal", "payoneer", "skrill", "other")
  .required()
  .messages({
    "any.required": "Payment method is required",
    "any.only":
      "Payment method must be one of bank_transfer, paypal, payoneer, skrill, or other",
  });

// Bank Transfer - Only required fields are marked
const bankTransferDetailsSchema = Joi.object({
  payment_method_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Payment method name is required",
    "string.empty": "Payment method name cannot be empty",
  }),
  beneficiary_name: Joi.string().trim().max(100).allow("", null).optional(),
  beneficiary_address: Joi.string().trim().allow("", null).optional(),
  bank_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Bank name is required",
    "string.empty": "Bank name cannot be empty",
  }),
  account_number: Joi.string().trim().max(100).required().messages({
    "any.required": "Account number is required",
    "string.empty": "Account number cannot be empty",
  }),
  ifsc_code: Joi.string().trim().max(50).required().messages({
    "any.required": "IFSC code is required",
    "string.empty": "IFSC code cannot be empty",
  }),
  swift: Joi.string().trim().max(50).allow("", null).optional(),
  iban: Joi.string().trim().max(100).allow("", null).optional(),
  sort_code: Joi.string().trim().max(50).allow("", null).optional(),
  bank_address: Joi.string().trim().required().messages({
    "any.required": "Bank address is required",
    "string.empty": "Bank address cannot be empty",
  }),
  country: Joi.string().trim().max(100).required().messages({
    "any.required": "Country is required",
    "string.empty": "Country cannot be empty",
  }),
  state_region: Joi.string().trim().max(100).allow("", null).optional(),
  city: Joi.string().trim().max(100).allow("", null).optional(),
  postal_code: Joi.string().trim().max(50).allow("", null).optional(),
});

// PayPal / Payoneer / Skrill
const emailPaymentDetailsSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required for this payment method",
    "string.email": "Invalid email address",
    "string.empty": "Email cannot be empty",
  }),
});

// Other
const otherPaymentDetailsSchema = Joi.object({
  payment_method_name: Joi.string().trim().max(100).required().messages({
    "any.required": "Payment method name is required for 'other' type",
    "string.empty": "Payment method name cannot be empty",
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
  note: Joi.string().trim().allow("", null).optional(),
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
  note: Joi.string().trim().allow("", null).optional(),
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
