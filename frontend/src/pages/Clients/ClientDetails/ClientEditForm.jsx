import { useState } from "react";
import api from "../../../utils/axiosInstance";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import CheckboxField from "../../../components/Form/CheckboxField";

const ClientEditForm = ({ client, id, navigate, setIsEditing }) => {
  const primaryUser = client.primary_users || {};

  const [formData, setFormData] = useState({
    type: client.type || "",
    company_name: client.company_name || "",
    legal_entity: client.legal_entity || "",
    status: client.status || "",
    country: client.country || "",
    state_region: client.state_region || "",
    city: client.city || "",
    postal_code: client.postal_code || "",
    address: client.address || "",
    pan_tax_number: client.pan_tax_number || "",
    gstin_vat_number: client.gstin_vat_number || "",
    website: client.website || "",
    note: client.note || "",
    can_login: client.can_login || false,

    first_name: primaryUser.first_name || "",
    last_name: primaryUser.last_name || "",
    email: client.auth?.email || "",
    phone: primaryUser.phone || "",
    timezone: primaryUser.timezone || "",
    gender: primaryUser.gender || "",
    zoom_id: primaryUser.zoom_id || "",
    teams_id: primaryUser.teams_id || "",
    nationality: primaryUser.nationality || "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      await api.put(`/clients/${id}`, formData, { withCredentials: true });
      alert("Client updated successfully");
      setIsEditing(false);
      navigate("/clients");
    } catch (err) {
      console.error(err);
      alert("Failed to update client");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Update Client Details
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="bg-white shadow rounded-lg p-8 space-y-6"
      >
        <h3 className="text-lg font-semibold text-gray-700">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormSelect
            label="Client Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={["Company", "Individual"]}
            required
          />

          {formData.type === "Company" ? (
            <FormInput
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          ) : (
            <div /> 
          )}

          <FormSelect
            label="Legal Entity"
            name="legal_entity"
            value={formData.legal_entity}
            onChange={handleChange}
            options={["Private", "Public", "Partnership"]}
            required
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["Active", "Inactive"]}
            required
          />

          <FormSelect
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            options={["India", "USA", "UK"]}
            required
          />

          <FormInput
            label="State/Region"
            name="state_region"
            value={formData.state_region}
            onChange={handleChange}
          />

          <FormInput
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <FormInput
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <FormInput
            label="PAN/Tax Number"
            name="pan_tax_number"
            value={formData.pan_tax_number}
            onChange={handleChange}
          />
          <FormInput
            label="GSTIN/VAT Number"
            name="gstin_vat_number"
            value={formData.gstin_vat_number}
            onChange={handleChange}
          />
          <FormInput
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />

          <div>
            <label className="block text-gray-700 font-bold mb-1">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none border-gray-300 focus:shadow-outline"
              rows={3}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700">
          Primary User Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormInput
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            options={["IST", "UTC", "GMT"]}
            required
          />

          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", "Others"]}
          />

          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
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
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        </div>

        <CheckboxField
          label="Can Login"
          name="can_login"
          checked={formData.can_login}
          onChange={handleChange}
        />

        <div className="mt-4 space-x-4"> <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700" > Save </button> <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700" > Cancel </button> </div>
      </form>

      {isModalOpen && (
        <ConfirmModal
          title="Confirm Save"
          message="Do you want to save these changes?"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleUpdateSubmit}
          confirmText="Save"
          confirmColor="bg-green-600"
          confirmHoverColor="hover:bg-green-700"
        />
      )}
    </div>
  );
};

export default ClientEditForm;
