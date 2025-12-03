import { useState } from "react";
import CheckboxField from "../../../../components/Form/CheckboxField";
import BackButton from "../../../../components/Button/BackButton";

const SettingsEditForm = ({ client, onCancel, onSave }) => {
  const [form, setForm] = useState({
    is_active: client?.is_active || false,
    can_receive_notifications: client?.can_receive_notifications || false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={onCancel} />
        <h2 className="text-2xl font-bold text-gray-900">
          Edit Settings
        </h2>
      </div>
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-8 space-y-5"
    >
      <CheckboxField
        label="Active"
        name="is_active"
        checked={form.is_active}
        onChange={handleChange}
      />

      <CheckboxField
        label="Receive Notifications"
        name="can_receive_notifications"
        checked={form.can_receive_notifications}
        onChange={handleChange}
      />

      <span className="text-gray-500 text-sm mt-1">
                Fields marked with <span className="text-red-600">*</span> are
                mandatory.
              </span>

      <div className="mt-4 space-x-4">
        <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Cancel
          </button>
      </div>
    </form>
    </div>
  );
};

export default SettingsEditForm;