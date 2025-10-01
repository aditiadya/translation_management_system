import React, { useState, useEffect } from "react";
import CheckboxField from "../../../components/Form/CheckboxField";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const LanguagePairForm = ({ itemToEdit, onSave, onCancel, languages }) => {
  const [formData, setFormData] = useState({
    source_language_id: "",
    target_language_id: "",
    active_flag: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        source_language_id: itemToEdit.sourceLanguage?.id || "",
        target_language_id: itemToEdit.targetLanguage?.id || "",
        active_flag: itemToEdit.active_flag,
      });
    } else {
      setFormData({
        source_language_id: "",
        target_language_id: "",
        active_flag: true,
      });
    }
  }, [itemToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.source_language_id || !formData.target_language_id) {
      setError("Both source and target languages must be selected.");
      return;
    }
    if (formData.source_language_id === formData.target_language_id) {
      setError("Source and target languages cannot be the same.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setIsModalOpen(false);
  };

  const title = itemToEdit ? "Edit Language Pair" : "Create Language Pair";

  return (
    <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Language</label>
            <select
              name="source_language_id"
              value={formData.source_language_id}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select source</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>

          <span className="text-2xl mt-6">→</span>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Language</label>
            <select
              name="target_language_id"
              value={formData.target_language_id}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select target</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <CheckboxField
          label="Active"
          name="active_flag"
          checked={formData.active_flag}
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onCancel} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition shadow">
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
        />
      )}
    </div>
  );
};

export default LanguagePairForm;