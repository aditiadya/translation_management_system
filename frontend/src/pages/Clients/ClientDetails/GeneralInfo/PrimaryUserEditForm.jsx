import { useState } from "react";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import CheckboxField from "../../../../components/Form/CheckboxField";
import BackButton from "../../../../components/Button/BackButton";

const genders = ["Male", "Female", "Other"];
const staticTimezones = ["UTC−12:00", "UTC−11:00", "UTC−10:00", "UTC−09:00"];

const PrimaryUserEditForm = ({ client, onCancel, onSave }) => {
  const primaryUser = client?.primary_user || {};

  const [form, setForm] = useState({
    first_name: primaryUser?.first_name || "",
    last_name: primaryUser?.last_name || "",
    phone: primaryUser?.phone || "",
    timezone: primaryUser?.timezone || "",
    teams_id: primaryUser?.teams_id || "",
    zoom_id: primaryUser?.zoom_id || "",
    gender: primaryUser?.gender || "",
    nationality: primaryUser?.nationality || "",
    can_login: client?.can_login || false,
  });

  const [errors, setErrors] = useState({});

    const validate = () => {
    const currentErrors = {};
    // if (!form.email) currentErrors.email = "Email is required.";
    if (!form.first_name) currentErrors.first_name = "First name is required.";
    if (!form.last_name) currentErrors.last_name = "Last name is required.";
    if (!form.nationality) currentErrors.nationality = "Nationality is required.";
    if (!form.timezone) currentErrors.timezone = "Timezone is required.";
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };
  const requiredFields = [
  "first_name",
  "last_name",
  // "email",
  "timezone",
  "nationality",
];
  const handleBlur = (e) => {
  const { name, value } = e.target;
  let errorMsg = "";

  if (
    (name === "company_name" && form.type === "Company" && !value) ||
    (requiredFields.includes(name) && !value)
  ) {
    errorMsg =
      name === "email"
        ? "Email is required."
        : `${name.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} is required.`;
  }

  setErrors((prev) => ({ ...prev, [name]: errorMsg }));
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={onCancel} />
        <h2 className="text-2xl font-bold text-gray-900">
          Edit Primary User
        </h2>
      </div>
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-8 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
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

        <FormSelect
          label="Timezone"
          name="timezone"
          value={form.timezone}
          onChange={handleChange}
          onBlur={handleBlur}
          options={staticTimezones}
          error={errors.timezone}
          required
        />

        <FormSelect
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={genders}
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
          label="Zoom ID"
          name="zoom_id"
          value={form.zoom_id}
          onChange={handleChange}
        />

        <FormInput
          label="Teams ID"
          name="teams_id"
          value={form.teams_id}
          onChange={handleChange}
        />

        <FormInput
          label="Nationality"
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.nationality}
          required
        />
      </div>

      <CheckboxField
        label="Can Login"
        name="can_login"
        checked={form.can_login}
        onChange={handleChange}
        hint={
              <span className="text-gray-500 text-sm mt-1">
                Fields marked with <span className="text-red-600">*</span> are
                mandatory.
              </span>
            }
      />

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

export default PrimaryUserEditForm;