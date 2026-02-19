import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import FormSelect from "../../components/Form/FormSelect";
import CheckboxField from "../../components/Form/CheckboxField";
import PaymentMethodFields from "../SystemValues/PaymentMethods/PaymentMethodFields";
import FormTextarea from "../../components/Form/TextArea";

const methodOptions = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "payoneer", label: "Payoneer" },
  { value: "skrill", label: "Skrill" },
  { value: "other", label: "Other" },
];

const INITIAL_FORM_STATE = {
  payment_method: "",
  note: "",
  active_flag: true,
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

const PaymentMethodStep = ({ onNext, onBack }) => {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await api.get("/admin-payment-methods");
      setMethods(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClick = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const handleEditClick = (method) => {
    console.log("Editing method:", method); // Debug log
    let detailsToFlatten = {};

    if (
      method.payment_method === "bank_transfer" &&
      method.bank_transfer_detail
    ) {
      detailsToFlatten = method.bank_transfer_detail;
    } else if (
      ["paypal", "payoneer", "skrill"].includes(method.payment_method) &&
      method.email_payment_detail
    ) {
      detailsToFlatten = method.email_payment_detail;
    } else if (
      method.payment_method === "other" &&
      method.other_payment_detail
    ) {
      detailsToFlatten = method.other_payment_detail;
    }

    const flattenedData = {
      ...INITIAL_FORM_STATE,
      ...method,
      ...detailsToFlatten,
      payment_method: method.payment_method, // Explicitly set payment_method
    };

    console.log("Flattened data for edit:", flattenedData); // Debug log
    setFormData(flattenedData);
    setEditingId(method.id);
    setShowForm(true);
    setError("");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
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

    try {
      const payload = {
        payment_method: formData.payment_method,
        active_flag: formData.active_flag,
        details: {},
      };

      // Only add note if it has a value
      if (formData.note && formData.note.trim()) {
        payload.note = formData.note;
      }

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

      console.log("Saving payload:", payload, "Editing ID:", editingId); // Debug log

      if (editingId) {
        await api.put(`/admin-payment-methods/${editingId}`, payload);
      } else {
        await api.post("/admin-payment-methods", payload);
      }
      await fetchMethods();
      setShowForm(false);
      setFormData(INITIAL_FORM_STATE);
      setEditingId(null);
      setError("");
    } catch (err) {
      console.error("Save error:", err); // Debug log
      setError(err.response?.data?.error || "Failed to save payment method");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin-payment-methods/${id}`);
      setMethods(methods.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setError("");
  };

  const canNext = methods.length > 0;

  return (
    <div className="flex flex-col h-full bg-white shadow-md rounded-lg">
      {!showForm ? (
        <>
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-center flex-1">
                Add Payment Methods
              </h2>
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {methods.length === 0 ? (
              <p className="text-gray-500">No payment methods added yet.</p>
            ) : (
              <ul className="space-y-2">
                {methods.map((method) => (
                  <li
                    key={method.id}
                    className="flex justify-between items-center border p-3 rounded-md"
                  >
                    <div className="flex flex-col flex-1">
                      {method.payment_method === "bank_transfer" ? (
                        <>
                          <span className="font-semibold text-base">
                            {methodOptions.find(
                              (m) => m.value === method.payment_method
                            )?.label}
                          </span>
                          <span className="text-sm text-gray-600">
                            {method.bank_transfer_detail?.payment_method_name}
                            {method.bank_transfer_detail?.bank_name && ` | ${method.bank_transfer_detail.bank_name}`}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              method.active_flag
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {method.active_flag ? "Active" : "Inactive"}
                          </span>
                        </>
                      ) : ["paypal", "payoneer", "skrill"].includes(
                        method.payment_method
                      ) ? (
                        <>
                          <span className="font-semibold text-base">
                            {methodOptions.find(
                              (m) => m.value === method.payment_method
                            )?.label}
                          </span>
                          <span className="text-sm text-gray-600">
                            {method.email_payment_detail?.email}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              method.active_flag
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {method.active_flag ? "Active" : "Inactive"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-base">
                            {methodOptions.find(
                              (m) => m.value === method.payment_method
                            )?.label || method.payment_method}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              method.active_flag
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {method.active_flag ? "Active" : "Inactive"}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-x-2 ml-2">
                      <button
                        onClick={() => handleEditClick(method)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 border-t flex justify-between">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Back
            </button>

            <button
              onClick={onNext}
              disabled={!canNext}
              className={`px-6 py-2 rounded ${
                !canNext
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-center items-start">
            <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg relative">
              <button
                type="button"
                onClick={handleCancel}
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
                {editingId ? "Edit Payment Method" : "Add Payment Method"}
              </h2>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <FormSelect
                  label="Payment Method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleFormChange}
                  options={methodOptions}
                  required
                  disabled={!!editingId}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                  <PaymentMethodFields
                    formData={formData}
                    handleChange={handleFormChange}
                  />

                  <div className="md:col-span-2">
                    <FormTextarea
                      label="Note"
                      name="note"
                      value={formData.note}
                      onChange={handleFormChange}
                      placeholder="Add any relevant notes here..."
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <CheckboxField
                      label="Active"
                      name="active_flag"
                      checked={formData.active_flag}
                      onChange={handleFormChange}
                      hint={
                        <span className="text-gray-500 text-sm mt-1">
                          Fields marked with <span className="text-red-600">*</span> are mandatory.
                        </span>
                      }
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodStep;
