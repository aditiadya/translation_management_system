import { useState, useEffect } from "react";
import FormInput from "../../../components/Form/FormInput";
import CheckboxField from "../../../components/Form/CheckboxField";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const SpecializationForm = ({ specToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: "", active_flag: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (!formData.name.trim()) return alert("Specialization name is required");
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {specToEdit ? "Edit Specialization" : "Add Specialization"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Specialization Name"
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
        />

        <div className="flex justify-center gap-4 mt-4">
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
  );
};

export default SpecializationForm;