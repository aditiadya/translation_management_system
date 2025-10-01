import { useState, useEffect } from "react";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const CurrencyForm = ({ currencyToEdit, currencies, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ currencyId: "", active_flag: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currencyToEdit) {
      setFormData({
        currencyId: currencyToEdit.currencyId,
        active_flag: currencyToEdit.active_flag,
      });
    } else {
      setFormData({ currencyId: "", active_flag: true });
    }
  }, [currencyToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.currencyId) return alert("Please select a currency.");
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    onSave(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-8 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {currencyToEdit ? "Edit Currency" : "Add Currency"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="currencyId"
          value={formData.currencyId}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            Select currency
          </option>
          {currencies.map((cur) => (
            <option key={cur.id} value={cur.id}>
              {cur.code} - {cur.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active_flag"
            checked={formData.active_flag}
            onChange={handleChange}
          />
          Active
        </label>

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

export default CurrencyForm;