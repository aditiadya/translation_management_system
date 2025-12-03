import { useState } from "react";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import BackButton from "../../../../components/Button/BackButton";
import FormTextarea from "../../../../components/Form/TextArea";

const statuses = ["Active", "Inactive", "Pending"];
const legalEntities = [
  "Private Limited",
  "LLP",
  "Sole Proprietorship",
  "Partnership",
];
const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Australia",
];
const clientTypes = ["Company", "Individual"];

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

  const validate = () => {
    const currentErrors = {};
    if (form.type === "Company" && !form.company_name)
      currentErrors.company_name = "Company name is required.";
    if (!form.legal_entity)
      currentErrors.legal_entity = "Legal Entity is required.";
    if (!form.status) currentErrors.status = "Status is required.";
    if (!form.country) currentErrors.country = "Country is required.";
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

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

  const requiredFields = ["type", "legal_entity", "status", "country"];
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
          : `${name
              .replace("_", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())} is required.`;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
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
        <h2 className="text-2xl font-bold text-gray-900">Edit General Info</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
          <FormSelect
            label="Client Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            onBlur={handleBlur}
            options={clientTypes}
            error={errors.type}
            required
          />

          {form.type === "Company" ? (
            <FormInput
              label="Company Name"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.company_name}
              required
            />
          ) : (
            <div />
          )}

          <FormSelect
            label="Legal Entity"
            name="legal_entity"
            value={form.legal_entity}
            onChange={handleChange}
            onBlur={handleBlur}
            options={legalEntities}
            error={errors.legal_entity}
            required
          />

          <FormSelect
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={statuses}
            onBlur={handleBlur}
            error={errors.status}
            required
          />

          <FormSelect
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            onBlur={handleBlur}
            options={countries}
            error={errors.country}
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

          <FormTextarea
            label="Note"
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            error={errors.note}
            required={false}
          />
        </div>

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

export default GeneralInfoEditForm;