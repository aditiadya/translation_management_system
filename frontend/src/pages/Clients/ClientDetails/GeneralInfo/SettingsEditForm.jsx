import { useState } from "react";
import CheckboxField from "../../../../components/Form/CheckboxField";
import Button from "../../../../components/Button/Button";
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <div className="flex items-center gap-4">
        <BackButton onClick={onCancel} />
        <h2 className="text-lg font-semibold text-gray-700">Edit Settings</h2>
      </div>
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

      <div className="flex gap-4">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SettingsEditForm;