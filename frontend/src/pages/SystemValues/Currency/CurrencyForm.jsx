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
    onSave(formData);
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
          className="w-full p-3 mb-5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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

export default CurrencyForm;