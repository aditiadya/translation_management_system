import React from "react";
import FormField from "./FormField";

const ProfileInfoCard = ({
  admin,
  isEditing,
  formData,
  setIsEditing,
  setFormData,
  handleChange,
  handleSave,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <div className="flex justify-between items-start pb-6 border-b mb-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">
              {admin.first_name} {admin.last_name}
            </h2>
            <p className="text-gray-500">{admin.email}</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Edit
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(admin);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        <FormField
          fieldKey="first_name"
          label="First Name"
          required
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="last_name"
          label="Last Name"
          required
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="gender"
          label="Gender"
          type="select"
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="username"
          label="Username"
          required
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="email"
          label="Email"
          required
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="phone"
          label="Phone (Optional)"
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="teams_id"
          label="Teams ID"
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="zoom_id"
          label="Zoom ID"
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="language_email"
          label="Language for Emails"
          type="select"
          required
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="time_zone"
          label="Time Zone"
          type="select"
          required
          {...{ isEditing, formData, admin, handleChange }}
        />
        <FormField
          fieldKey="createdAt"
          label="Registered At"
          readOnly
          {...{ isEditing, formData, admin, handleChange }}
        />
      </div>
    </div>
  );
};

export default ProfileInfoCard;