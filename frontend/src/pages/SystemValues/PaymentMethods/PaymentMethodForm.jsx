import { useState, useEffect } from "react";
import FormInput from "../../../components/Form/FormInput";
import CheckboxField from "../../../components/Form/CheckboxField";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const PaymentMethodForm = ({ methodToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    payment_type: "",
    bank_info: "",
    description: "",
    active: true,
  });
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (methodToEdit) setFormData(methodToEdit);
    else
      setFormData({
        name: "",
        payment_type: "",
        bank_info: "",
        description: "",
        active: true,
      });
  }, [methodToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.payment_type.trim()) {
      setError("Name and Payment Type are required.");
      return;
    }
    setError("");
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 pt-12">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {methodToEdit ? "Edit Payment Method" : "Add Payment Method"}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="focus:ring-green-500 focus:border-green-500"
          />

          <FormInput
            label="Payment Type"
            name="payment_type"
            value={formData.payment_type}
            onChange={handleChange}
            required
            className="focus:ring-green-500 focus:border-green-500"
          />

          <FormInput
            label="Bank Info"
            name="bank_info"
            value={formData.bank_info}
            onChange={handleChange}
            className="focus:ring-green-500 focus:border-green-500"
          />

          <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            className="focus:ring-green-500 focus:border-green-500"
          />

          <CheckboxField
            label="Active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition shadow"
            >
              Save
            </button>
          </div>
        </form>

        {isModalOpen && (
          <ConfirmModal
            title="Confirm Save"
            message="Do you want to save these changes?"
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleConfirmSave}
            confirmText="Save"
            confirmColor="bg-green-600"
            confirmHoverColor="hover:bg-green-700"
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodForm;