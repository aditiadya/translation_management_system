import { useState, useEffect } from "react";
import CheckboxField from "../../../components/Form/CheckboxField";

const CurrencyForm = ({ currencyToEdit, currencies, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    currencyId: "",
    active_flag: true,
  });

  useEffect(() => {
    if (currencyToEdit) {
      setFormData({
        currencyId: currencyToEdit.currency_id,
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
    onSave(formData);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 pt-12">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {currencyToEdit ? "Edit Currency" : "Add Currency"}
        </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <select
          name="currencyId"
          value={formData.currencyId}
          onChange={handleChange}
          className="w-full p-2 mb-5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow"
            >
              Save
            </button>
        </div>
      </form>
    </div>
     </div>
  );
};

export default CurrencyForm;