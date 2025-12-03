import { useState } from "react";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import CheckboxField from "../../../../components/Form/CheckboxField";
import FormTextarea from "../../../../components/Form/TextArea";
import BackButton from "../../../../components/Button/BackButton";

const vendorTypes = ["Company", "Freelance", "In-House"];
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

const toOptionObjects = (arr) => arr.map((v) => ({ value: v, label: v }));

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

  const validate = () => {
    const currentErrors = {};
    if (form.type === "Company" && !form.company_name)
      currentErrors.company_name = "Company name is required.";
    if (!form.legal_entity) currentErrors.legal_entity = "Legal Entity is required.";
    if (!form.country) currentErrors.country = "Country is required.";

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const requiredFields = [
    "type",
    "legal_entity",
    "country",
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

  // updated to support both native events and select components that pass (name, value) or just value
  const handleChange = (eOrValue, maybeName) => {
    // Case 1: native event
    if (eOrValue && eOrValue.target) {
      const { name, type, value, checked } = eOrValue.target;
      const newVal = type === "checkbox" ? checked : value;
      setForm((prev) => {
        const updatedForm = { ...prev, [name]: newVal };
        if (name === "type" && newVal !== "Company") {
          updatedForm.company_name = "";
        }
        return updatedForm;
      });
      return;
    }

    // Case 2: FormSelect calls onChange(value) or onChange({ value, label })
    // eOrValue is the value or an option object; maybeName can be provided if FormSelect calls onChange(value, name)
    let value;
    if (eOrValue && typeof eOrValue === "object" && "value" in eOrValue) {
      value = eOrValue.value;
    } else {
      value = eOrValue;
    }

    const name = maybeName || (typeof maybeName === "string" ? maybeName : null);

    // If the select didn't pass a name, we expect the FormSelect to have been wired with name in other ways.
    // In your usage below we will call handleChange with (value, "fieldName") for selects to be explicit.
    if (!name) return;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "type" && value !== "Company") {
        updatedForm.company_name = "";
      }
      return updatedForm;
    });
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
          Edit General Info
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
          <FormSelect
            label="Vendor Type"
            name="type"
            value={form.type}
            onChange={(v) => handleChange(v, "type")} // explicit for custom selects
            onBlur={handleBlur}
            options={toOptionObjects(vendorTypes)}
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
            onChange={(v) => handleChange(v, "legal_entity")}
            onBlur={handleBlur}
            options={toOptionObjects(legalEntities)} // <-- pass objects so select can find match
            error={errors.legal_entity}
            required
          />

          <FormSelect
            label="Country"
            name="country"
            value={form.country}
            onChange={(v) => handleChange(v, "country")}
            onBlur={handleBlur}
            options={toOptionObjects(countries)} // <-- pass objects so select can find match
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
            rows={1}
            error={errors.note}
            required={false}
          />
        </div>

        <CheckboxField
          label="Assignable to jobs"
          name="assignable_to_jobs"
          checked={form.assignable_to_jobs}
          onChange={handleChange}
          hint="If checked, the vendor can be assigned to a job regardless of whether Can log in is set or not."
        />

        <CheckboxField
          label="Finances Visible"
          name="finances_visible"
          checked={form.finances_visible}
          onChange={handleChange}
          hint="If checked, the vendor has access to their own payables, invoices and payments."
        />
        <div>
          <span className="text-gray-500 text-sm">
            Fields marked with <span className="text-red-600">*</span> are
            mandatory.
          </span>
        </div>

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