import { useState, useEffect } from "react";
import FormInput from "../../../components/Form/FormInput";
import CheckboxField from "../../../components/Form/CheckboxField";

const SpecializationForm = ({ specToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: "", active_flag: true });

  useEffect(() => {
    if (specToEdit) {
      setFormData({
        name: specToEdit.name,
        active_flag: specToEdit.active_flag,
      });
    } else {
      setFormData({ name: "", active_flag: true });
    }
  }, [specToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return alert("Specialization name is required");
    }
    onSave(formData);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {specToEdit ? "Edit Specialization" : "Add Specialization"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <CheckboxField
          label="Active"
          name="active_flag"
          checked={formData.active_flag}
          onChange={handleChange}
          hint={
            <span className="text-gray-500 text-sm mt-1">
              Fields marked with <span className="text-red-600">*</span> are
              mandatory.
            </span>
          }
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpecializationForm;