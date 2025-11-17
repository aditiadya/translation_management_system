import { useState, useEffect } from "react";
import api from "../../../utils/axiosInstance";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import CheckboxField from "../../../components/Form/CheckboxField";
import BackButton from "../../../components/Button/BackButton";

const ManagerEditForm = ({
  manager,
  id,
  navigate,
  setIsEditing,
  refreshManager,
}) => {
  const [formData, setFormData] = useState({
    first_name: manager.first_name,
    last_name: manager.last_name,
    role_id: manager.role.role_id.toString(),
    client_pool_id: manager.client_pool?.id?.toString() || "",
    gender: manager.gender || "",
    email: manager.auth.email,
    phone: manager.phone,
    teams_id: manager.teams_id,
    zoom_id: manager.zoom_id,
    timezone: manager.timezone,
    can_login: manager.can_login,
  });
  const [clientPools, setClientPools] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const res = await api.get("/manager-roles", { withCredentials: true });
      setRoles(res.data.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err.response || err);
    }
  };

  const fetchClientPools = async () => {
    try {
      const res = await api.get("/client-pools", { withCredentials: true });
      setClientPools(res.data.data);
    } catch (err) {
      console.error("Failed to fetch client pools:", err.response || err);
    }
  };

  fetchRoles();
  fetchClientPools();
}, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateSubmit = async () => {
  try {
    const payload = {
      ...formData,
      role_id: Number(formData.role_id),
      client_pool_id: formData.client_pool_id
        ? Number(formData.client_pool_id)
        : null,
    };

    await api.put(`/managers/${id}`, payload, { withCredentials: true });
    await refreshManager();
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    alert("Failed to update manager");
  }
};

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BackButton onClick={() => setIsEditing(false)} />
        <h2 className="text-2xl font-bold text-gray-900">
          Update Manager Details
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateSubmit();
        }}
        className="bg-white shadow rounded-lg p-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
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
          <FormSelect
  label="Role"
  name="role_id"
  value={formData.role_id}
  onChange={handleChange}
  options={roles.map((role) => ({
    label: role.name,
    value: role.id.toString(),
  }))}
  required
/>
          <FormSelect
            label="Client Pool"
            name="client_pool_id"
            value={formData.client_pool_id}
            onChange={handleChange}
            options={clientPools.map((pool) => ({
              value: pool.id.toString(),
              label: pool.name,
            }))}
          />

          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <FormInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
          <FormInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <FormInput
            label="Teams ID"
            name="teams_id"
            value={formData.teams_id}
            onChange={handleChange}
          />
          <FormInput
            label="Zoom ID"
            name="zoom_id"
            value={formData.zoom_id}
            onChange={handleChange}
          />
          <FormInput
            label="Timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
          />
          <CheckboxField
            label="Can Login"
            name="can_login"
            checked={formData.can_login}
            onChange={handleChange}
            hint={
              <span className="text-gray-500 text-sm mt-1">
                Fields marked with <span className="text-red-600">*</span> are
                mandatory.
              </span>
            }
          />
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
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerEditForm;