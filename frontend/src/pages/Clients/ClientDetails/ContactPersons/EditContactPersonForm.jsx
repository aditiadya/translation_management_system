import { useState, useEffect } from "react";
import BackButton from "../../../../components/Button/BackButton";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import CheckboxField from "../../../../components/Form/CheckboxField";
import FormTextarea from "../../../../components/Form/TextArea";

const genders = ["Male", "Female", "Other"];

const EditContactPersonForm = ({ person, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...person });

  useEffect(() => {
    setFormData({ ...person });
  }, [person]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(person.id, formData);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={onClose} />
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Contact Person
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
          <FormInput
            label="First Name"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Last Name"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genders}
          />

          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />

          <FormInput
            label="Zoom ID"
            name="zoom_id"
            value={formData.zoom_id}
            onChange={handleChange}
          />
          <FormInput
            label="Teams ID"
            name="teams_id"
            value={formData.teams_id}
            onChange={handleChange}
          />

          <FormInput
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />

          <FormTextarea
            label="Note"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            required={false}
          />
        </div>

        <CheckboxField
          label="Active"
          name="is_active"
          checked={!!formData.is_active}
          onChange={handleChange}
        />

        <CheckboxField
          label="Is Invoicing"
          name="is_invoicing"
          checked={!!formData.is_invoicing}
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
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContactPersonForm;