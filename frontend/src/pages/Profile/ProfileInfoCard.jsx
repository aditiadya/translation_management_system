import FormField from "./FormField";
import { useRef } from "react";

const ProfileInfoCard = ({
  admin,
  isEditing,
  formData,
  setIsEditing,
  setFormData,
  handleChange,
  handleSave,
  profileImage,
  onImageUpload,
  onImageDelete,
}) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageUpload(file);
    // Reset input so same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <div className="flex justify-between items-start pb-6 border-b mb-6">
        <div className="flex items-center space-x-4">

          {/* Profile Image */}
          <div className="relative group">
            <img
              src={profileImage || `https://ui-avatars.com/api/?name=${admin.first_name}+${admin.last_name}&background=random`}
              alt="Profile"
              className={`w-16 h-16 rounded-full object-cover ${isEditing ? "cursor-pointer" : ""}`}
              onClick={handleImageClick}
            />

            {/* Hover overlay — only in edit mode */}
            {isEditing && (
              <div
                onClick={handleImageClick}
                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            )}

            {/* Delete button — only in edit mode and if a real image exists */}
            {isEditing && profileImage && (
              <button
                onClick={onImageDelete}
                title="Remove photo"
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
              >
                ✕
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
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
        <FormField fieldKey="first_name" label="First Name" required {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="last_name" label="Last Name" required {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="gender" label="Gender" type="select" {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="username" label="Username" required {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="email" label="Email" required {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="phone" label="Phone (Optional)" {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="teams_id" label="Teams ID" {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="zoom_id" label="Zoom ID" {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="language_email" label="Language for Emails" type="select" required {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="time_zone" label="Time Zone" type="select" required {...{ isEditing, formData, admin, handleChange }} />
        <FormField fieldKey="createdAt" label="Registered At" readOnly {...{ isEditing, formData, admin, handleChange }} />
      </div>

      {isEditing && (
        <p className="text-sm text-gray-500 mt-2">
          Fields marked with <span className="text-red-500 font-semibold">*</span> are mandatory.
        </p>
      )}
    </div>
  );
};

export default ProfileInfoCard;