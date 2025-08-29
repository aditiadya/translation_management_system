import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import { FiUser, FiSettings, FiMoreHorizontal, FiLock } from "react-icons/fi";

const FormField = React.memo(
  ({
    fieldKey,
    label,
    type = "text",
    required = false,
    readOnly = false,
    isEditing,
    formData,
    admin,
    handleChange,
  }) => {
    const value = isEditing ? formData[fieldKey] ?? "" : admin[fieldKey] ?? "-";

    if (readOnly) {
      return (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <p className="text-gray-800 p-2.5">{value}</p>
        </div>
      );
    }

    return (
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          type === "select" ? (
            <select
              name={fieldKey}
              value={value}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="">Select {label}</option>
              {fieldKey === "gender" && (
                <>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </>
              )}
              {fieldKey === "email_language" && (
                <>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </>
              )}
              {fieldKey === "time_zone" && (
                <>
                  <option value="IST">India Standard Time (IST)</option>
                  <option value="PST">Pacific Standard Time (PST)</option>
                  <option value="EST">Eastern Standard Time (EST)</option>
                </>
              )}
            </select>
          ) : (
            <input
              type="text"
              name={fieldKey}
              value={value}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder={`Your ${label}`}
            />
          )
        ) : (
          <p className="text-gray-800 bg-gray-50 rounded-md w-3/4 p-2.5">
            {value}
          </p>
        )}
      </div>
    );
  }
);

const ProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [detailsRes, authRes] = await Promise.all([
          api.get("/admin-details"),
          api.get("/auth/me"),
        ]);

        if (detailsRes.data.success && authRes.data) {
          const mergedData = {
            ...detailsRes.data.data,
            email: authRes.data.email,
          };

          setAdmin(mergedData);
          setFormData(mergedData);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { email, ...updateData } = formData;

      const res = await api.put("/admin-details", updateData);
      if (res.data.success) {
        setAdmin({ ...res.data.data, email });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (!admin)
    return (
      <p className="text-center p-6 bg-gray-100 min-h-screen">Loading...</p>
    );

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-1/5 bg-white p-6 flex flex-col space-y-4 shadow-sm">
          <button className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium">
            <FiUser size={20} />
            <span>My Profile</span>
          </button>
          <button className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <FiSettings size={20} />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <FiMoreHorizontal size={20} />
            <span>Option</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Profile Info Card */}
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
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="last_name"
                label="Last Name"
                required
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="gender"
                label="Gender"
                type="select"
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="username"
                label="Username"
                required
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="email"
                label="Email"
                required
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="phone"
                label="Phone (Optional)"
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="teams_id"
                label="Teams ID"
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="zoom_id"
                label="Zoom ID"
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="email_language"
                label="Language for Emails"
                type="select"
                required
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="time_zone"
                label="Time Zone"
                type="select"
                required
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
              <FormField
                fieldKey="createdAt"
                label="Registered At"
                readOnly
                isEditing={isEditing}
                formData={formData}
                admin={admin}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2">
              <FiLock size={18} />
              <span>Change Password</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
