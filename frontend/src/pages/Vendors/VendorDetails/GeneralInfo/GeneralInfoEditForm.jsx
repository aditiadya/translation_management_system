import { useState } from "react";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import CheckboxField from "../../../../components/Form/CheckboxField";
import Button from "../../../../components/Button/Button";
import BackButton from "../../../../components/Button/BackButton";

const GeneralInfoEditForm = ({ vendor, onCancel, onSave }) => {
  const [form, setForm] = useState({
    company_name: vendor?.company_name || "",
    type: vendor?.type || "",
    legal_entity: vendor?.legal_entity || "",
    pan_tax_number: vendor?.pan_tax_number || "",
    gstin_vat_number: vendor?.gstin_vat_number || "",
    website: vendor?.website || "",
    address: vendor?.address || "",
    country: vendor?.country || "",
    state_region: vendor?.state_region || "",
    city: vendor?.city || "",
    postal_code: vendor?.postal_code || "",
    note: vendor?.note || "",
    assignable_to_jobs: vendor?.assignable_to_jobs || false,
    finances_visible: vendor?.finances_visible || false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: type === "checkbox" ? checked : value  };

      if (name === "type" && value !== "Company") {
        updatedForm.company_name = "";
      }

      return updatedForm;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "company_name" && form.type === "Company" && !value.trim()) {
      error = "Company Name is required";
    }

    if (name === "type" && !value.trim()) {
      error = "Vendor Type is required";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.type === "Company" && !form.company_name.trim()) {
      newErrors.company_name = "Company Name is required";
    }
    if (!form.type.trim()) newErrors.type = "Vendor Type is required";

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
        <BackButton to="/vendors" />
      <h2 className="text-lg font-semibold text-gray-700">Edit General Info</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          onBlur={handleBlur}
          options={[
            { value: "Company", label: "Company" },
            { value: "Freelance", label: "Freelance" },
            { value: "In-House", label: "In-House" },
          ]}
          required
        />

        {form.type === "Company" ? (
          <FormInput
            label="Company Name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        ) : (
          <div />
        )}

        <FormInput
          label="Legal Entity"
          name="legal_entity"
          value={form.legal_entity}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <FormInput
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <FormInput
          label="State / Region"
          name="state_region"
          value={form.state_region}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="Postal Code"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="PAN / Tax Number"
          name="pan_tax_number"
          value={form.pan_tax_number}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="GSTIN / VAT Number"
          name="gstin_vat_number"
          value={form.gstin_vat_number}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="Website"
          name="website"
          value={form.website}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <FormInput
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
          type="textarea"
          onBlur={handleBlur}
        />
      </div>

      <CheckboxField
        label="Assignable to jobs"
        name="assignable_to_jobs"
        checked={form.assignable_to_jobs}
        onChange={handleChange}
      />

      <CheckboxField
        label="Finances Visible"
        name="finances_visible"
        checked={form.finances_visible}
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

export default GeneralInfoEditForm;