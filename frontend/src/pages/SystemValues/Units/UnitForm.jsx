import { useState, useEffect } from "react";
import FormInput from "../../../components/Form/FormInput";
import CheckboxField from "../../../components/Form/CheckboxField";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const UnitForm = ({ unitToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: "", active_flag: true, is_word: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (unitToEdit) {
      setFormData({
        name: unitToEdit.name,
        active_flag: unitToEdit.active_flag,
        is_word: unitToEdit.is_word,
      });
    } else {
      setFormData({ name: "", active_flag: true, is_word: true });
    }
  }, [unitToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Unit name is required");
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {unitToEdit ? "Edit Unit" : "Add Unit"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Unit Name"
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
        <CheckboxField
          label="Is Word"
          name="is_word"
          checked={formData.is_word}
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

export default UnitForm;