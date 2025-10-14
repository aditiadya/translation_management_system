import { useState } from "react";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import Button from "../../../../components/Button/Button";
import BackButton from "../../../../components/Button/BackButton";

const GeneralInfoEditForm = ({ client, onCancel, onSave }) => {
  const [form, setForm] = useState({
    company_name: client?.company_name || "",
    type: client?.type || "",
    legal_entity: client?.legal_entity || "",
    status: client?.status || "",
    pan_tax_number: client?.pan_tax_number || "",
    gstin_vat_number: client?.gstin_vat_number || "",
    website: client?.website || "",
    address: client?.address || "",
    country: client?.country || "",
    state_region: client?.state_region || "",
    city: client?.city || "",
    postal_code: client?.postal_code || "",
    note: client?.note || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

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
      error = "Client Type is required";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.type === "Company" && !form.company_name.trim()) {
      newErrors.company_name = "Company Name is required";
    }
    if (!form.type.trim()) newErrors.type = "Client Type is required";

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
        <BackButton onClick={onCancel} />
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
            { value: "Individual", label: "Individual" },
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

        <FormSelect
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
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