import { useState } from "react";
import api from "../../../utils/axiosInstance";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import CheckboxField from "../CheckboxField";

const ManagerEditForm = ({ manager, id, navigate, setIsEditing }) => {
  const [formData, setFormData] = useState({
    first_name: manager.first_name,
    last_name: manager.last_name,
    role_id: manager.role.role_id.toString(),
    client_pool: manager.client_pool,
    gender: manager.gender,
    email: manager.auth.email,
    phone: manager.phone,
    teams_id: manager.teams_id,
    zoom_id: manager.zoom_id,
    timezone: manager.timezone,
    can_login: manager.can_login,
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
      await api.put(`/managers/${id}`, formData, { withCredentials: true });
      alert("Manager updated successfully");
      setIsEditing(false);
      navigate("/managers");
    } catch (err) {
      console.error(err);
      alert("Failed to update manager");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Update Manager Details
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="bg-white shadow rounded-lg p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            options={[
              { label: "Administrator", value: "1" },
              { label: "Project Manager", value: "2" },
              { label: "Translation Manager", value: "3" },
            ]}
            required
          />
          <FormInput
            label="Client Pool"
            name="client_pool"
            value={formData.client_pool}
            onChange={handleChange}
          />
          <FormSelect
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={["Male", "Female", ""]}
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
          />
        </div>

        <div className="mt-4 space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
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

export default ManagerEditForm;
