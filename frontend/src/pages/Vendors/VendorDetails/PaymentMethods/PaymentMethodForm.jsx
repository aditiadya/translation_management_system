import { useState, useEffect } from "react";
import FormSelect from "../../../../components/Form/FormSelect";
import CheckboxField from "../../../../components/Form/CheckboxField";
import PaymentMethodFields from "./PaymentMethodFields";
import FormTextarea from "../../../../components/Form/TextArea";

const methodOptions = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "payoneer", label: "Payoneer" },
  { value: "skrill", label: "Skrill" },
  { value: "other", label: "Other" },
];

const INITIAL_STATE = {
  payment_method: "",
  note: "",
  active_flag: true,
  is_default: false,
  payment_method_name: "",
  beneficiary_name: "",
  beneficiary_address: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  swift: "",
  iban: "",
  sort_code: "",
  bank_address: "",
  country: "",
  state_region: "",
  city: "",
  postal_code: "",
  email: "",
};

const PaymentMethodForm = ({ methodToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (methodToEdit) {
      let detailsToFlatten = {};

      if (
        methodToEdit.payment_method === "bank_transfer" &&
        methodToEdit.bank_transfer_detail
      ) {
        detailsToFlatten = methodToEdit.bank_transfer_detail;
      } else if (
        ["paypal", "payoneer", "skrill"].includes(
          methodToEdit.payment_method
        ) &&
        methodToEdit.email_payment_detail
      ) {
        detailsToFlatten = methodToEdit.email_payment_detail;
      } else if (
        methodToEdit.payment_method === "other" &&
        methodToEdit.other_payment_detail
      ) {
        detailsToFlatten = methodToEdit.other_payment_detail;
      }

      const flattenedData = {
        ...INITIAL_STATE,
        ...methodToEdit,
        ...detailsToFlatten,
      };

      setFormData(flattenedData);
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [methodToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.payment_method) {
      setError("Please select a Payment Method.");
      return;
    }
    if (formData.payment_method === "bank_transfer" && !formData.bank_name) {
      setError("Bank Name is required for Bank Transfer.");
      return;
    }
    if (
      ["paypal", "payoneer", "skrill"].includes(formData.payment_method) &&
      !formData.email
    ) {
      setError("Email is required for this payment method.");
      return;
    }
    if (formData.payment_method === "other" && !formData.payment_method_name) {
      setError("Payment Method Name is required for 'Other' method.");
      return;
    }

    setError("");
    setSaving(true);

    const payload = {
      payment_method: formData.payment_method,
      note: formData.note,
      active_flag: formData.active_flag,
      is_default: formData.is_default,
      details: {},
    };

    if (formData.payment_method === "bank_transfer") {
      payload.details = {
        payment_method_name: formData.payment_method_name,
        beneficiary_name: formData.beneficiary_name,
        beneficiary_address: formData.beneficiary_address,
        bank_name: formData.bank_name,
        account_number: formData.account_number,
        ifsc_code: formData.ifsc_code,
        swift: formData.swift,
        iban: formData.iban,
        sort_code: formData.sort_code,
        bank_address: formData.bank_address,
        country: formData.country,
        state_region: formData.state_region,
        city: formData.city,
        postal_code: formData.postal_code,
      };
    } else if (
      ["paypal", "payoneer", "skrill"].includes(formData.payment_method)
    ) {
      payload.details = { email: formData.email };
    } else if (formData.payment_method === "other") {
      payload.details = { payment_method_name: formData.payment_method_name };
    }

    try {
      await onSave(payload);
    } catch (error) {
      setError("Failed to save payment method. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 pt-12">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-7 left-7 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {methodToEdit ? "Edit Payment Method" : "Add Payment Method"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <FormSelect
            label="Payment Method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            options={methodOptions}
            required
            disabled={!!methodToEdit}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <PaymentMethodFields
              formData={formData}
              handleChange={handleChange}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add any relevant notes here..."
                rows={4}
              />
            </div>

            <div className="md:col-span-2">
              <CheckboxField
                label="Set as active payment method"
                name="active_flag"
                checked={formData.active_flag}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <CheckboxField
                label="Set as default payment method"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
