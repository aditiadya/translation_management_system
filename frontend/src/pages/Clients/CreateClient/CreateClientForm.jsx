import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import CheckboxField from "../../../components/Form/CheckboxField";
import FormTextarea from "../../../components/Form/TextArea";
import Button from "../../../components/Button/Button";

const staticTimezones = ["UTC−12:00", "UTC−11:00", "UTC−10:00", "UTC−09:00"];
const clientTypes = ["Company", "Individual"];
const statuses = ["Active", "Inactive", "Pending"];
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

const CreateClientForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // ClientDetails
    type: "",
    company_name: "",
    legal_entity: "",
    status: "",
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
    email: "",

    // ClientPrimaryUserDetails
    first_name: "",
    last_name: "",
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
    if (!form.email) currentErrors.email = "Email is required.";
    if (!form.first_name) currentErrors.first_name = "First name is required.";
    if (!form.last_name) currentErrors.last_name = "Last name is required.";
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (
      (name === "company_name" && form.type === "Company" && !value) ||
      (["email", "first_name", "last_name"].includes(name) && !value)
    ) {
      errorMsg = `${name.replace("_", " ")} is required.`;
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
      const response = await api.post("/clients", form, {
        withCredentials: true,
      });
      setSuccess(response.data.message);
      navigate("/clients");
      setServerError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setServerError(
        err.response?.data?.message ||
          "Something went wrong while creating client."
      );
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Company Info */}
      <h3 className="text-lg font-semibold text-gray-700">
        Client Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 ">
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
          error={errors.status}
          required
        />

        <FormSelect
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
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
          label="Postal Code"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
        />
        <FormInput
          label="Address"
          name="address"
          value={form.address}
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
          rows={3}
          error={errors.note}
          required={false}
        />
      </div>

      <hr className="my-8 border-t border-gray-300" />

      {/* Primary User Info */}
      <h3 className="text-lg font-semibold text-gray-700">
        Primary User Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
        />
      </div>

      {/* Can Login */}
      <CheckboxField
        label="Can Login"
        name="can_login"
        checked={form.can_login}
        onChange={handleChange}
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

      <div className="flex justify-center">
        <Button type="submit">Create Client</Button>
      </div>
    </form>
  );
};

export default CreateClientForm;
