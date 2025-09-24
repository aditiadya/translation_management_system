import { useState } from "react";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import CheckboxField from "../../../../components/Form/CheckboxField";
import Button from "../../../../components/Button/Button";
import BackButton from "../../../../components/Button/BackButton";

const PrimaryUserEditForm = ({ client, onCancel, onSave }) => {
  const primaryUser = client?.primary_users || {};

  const [form, setForm] = useState({
    first_name: primaryUser?.first_name || "",
    last_name: primaryUser?.last_name || "",
    phone: primaryUser?.phone || "",
    timezone: primaryUser?.timezone || "",
    teams_id: primaryUser?.teams_id || "",
    zoom_id: primaryUser?.zoom_id || "",
    gender: primaryUser?.gender || "",
    can_login: primaryUser?.can_login || false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if ((name === "first_name" || name === "last_name") && !value.trim()) {
      error = `${name.replace("_", " ")} is required`;
    }

    if (name === "timezone" && !value.trim()) {
      error = "Timezone is required";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.first_name.trim())
      newErrors.first_name = "First Name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last Name is required";
    if (!form.timezone.trim()) newErrors.timezone = "Timezone is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      <div className="flex items-center gap-4">
        <BackButton to="/clients" />
        <h2 className="text-lg font-semibold text-gray-700">
          Edit Primary User
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.first_name}
          required
        />

        <FormInput
          label="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.last_name}
          required
        />

        <FormInput
          label="Timezone"
          name="timezone"
          value={form.timezone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.timezone}
          required
        />

        <FormInput
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
        />

        <FormInput
          label="Teams ID"
          name="teams_id"
          value={form.teams_id}
          onChange={handleChange}
        />

        <FormInput
          label="Zoom ID"
          name="zoom_id"
          value={form.zoom_id}
          onChange={handleChange}
        />

        <FormSelect
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
      </div>

      <CheckboxField
        label="Can Login"
        name="can_login"
        checked={form.can_login}
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

export default PrimaryUserEditForm;
