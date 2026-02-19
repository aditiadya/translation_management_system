import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import FormTextarea from "../../../components/Form/TextArea";
import CheckboxField from "../../../components/Form/CheckboxField";
import { getTimezonesWithOffset } from "../../../utils/constants/timezones";

const staticTimezones = getTimezonesWithOffset();

const vendorTypes = ["Company", "Freelance", "In-House"];
const genders = ["Male", "Female", "Other"];
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

const CreateVendorForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    company_name: "",
    legal_entity: "",
    country: "",
    state_region: "",
    city: "",
    postal_code: "",
    address: "",
    pan_tax_number: "",
    gstin_vat_number: "",
    website: "",
    note: "",
    can_login: false,
    assignable_to_jobs: false,
    finances_visible: false,

    first_name: "",
    last_name: "",
    email: "",
    timezone: "",
    phone: "",
    zoom_id: "",
    teams_id: "",
    gender: "",
    nationality: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const currentErrors = {};
    if (form.type === "Company" && !form.company_name)
      currentErrors.company_name = "Company name is required.";
    if (!form.legal_entity) currentErrors.legal_entity = "Legal Entity is required."; 
     if (!form.country) currentErrors.country = "Country is required.";
    if (!form.email) currentErrors.email = "Email is required.";
    if (!form.first_name) currentErrors.first_name = "First name is required.";
    if (!form.last_name) currentErrors.last_name = "Last name is required.";
    if (!form.nationality) currentErrors.nationality = "Nationality is required.";
     if (!form.timezone) currentErrors.timezone = "Timezone is required.";
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

    const requiredFields = [
  "type",
  "legal_entity",
  "country",
  "first_name",
  "last_name",
  "email",
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
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post("/vendors", form, {
        withCredentials: true,
      });
      setSuccess(response.data.message);
      navigate("/vendors");
      setServerError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setServerError(
        err.response?.data?.message ||
          "Something went wrong while creating vendor."
      );
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white shadow rounded-lg p-8 space-y-5">
      {/* Company Info */}
      <h3 className="text-lg font-semibold text-gray-700">Vendor Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
        <FormSelect
          label="Vendor Type"
          name="type"
          value={form.type}
          onChange={handleChange}
          onBlur={handleBlur}
          options={vendorTypes}
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
          label="State/Region"
          name="state_region"
          value={form.state_region}
          onChange={handleChange}
        />

        <FormInput
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
        />
        
        <FormInput
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <FormInput
          label="Postal Code"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
        />
        
        <FormInput
          label="PAN/Tax Number"
          name="pan_tax_number"
          value={form.pan_tax_number}
          onChange={handleChange}
        />
        <FormInput
          label="GSTIN/VAT Number"
          name="gstin_vat_number"
          value={form.gstin_vat_number}
          onChange={handleChange}
        />
        <FormInput
          label="Website"
          name="website"
          value={form.website}
          onChange={handleChange}
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

        <CheckboxField
          label="Assignable to jobs"
          name="assignable_to_jobs"
          checked={form.assignable_to_jobs}
          onChange={handleChange}
          hint="If checked, the vendor can be assigned to a job regardless of whether Can log in is set or not."
        />
        <div></div>
        <CheckboxField
          label="Finances visisble"
          name="finances_visible"
          checked={form.finances_visible}
          onChange={handleChange}
          hint="If checked, the vendor has access to their own payables, invoices and payments."
        />
      </div>

      <hr className="my-8 border-t border-gray-300" />

      {/* Primary User Info */}
      <h3 className="text-lg font-semibold text-gray-700">
        Primary User Details
      </h3>
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

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
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
          error={errors.gender}
        />

        <FormInput
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
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

      {/* Can Login */}
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

      {serverError && (
        <div className="bg-red-100 text-red-700 border border-red-400 rounded p-3 text-center font-semibold">
          {serverError}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 border border-green-400 rounded p-3 text-center font-semibold">
          {success}
        </div>
      )}

      <div className="mt-4 space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => navigate("/vendors")}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateVendorForm;