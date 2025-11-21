import React, { useState } from "react";
import Button from "../../components/Button/Button";
import api from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const currentErrors = {};
    if (!form.currentPassword)
      currentErrors.currentPassword = "Current password is required.";
    if (!form.newPassword)
      currentErrors.newPassword = "New password is required.";
    if (!form.confirmNewPassword)
      currentErrors.confirmNewPassword = "Please confirm your new password.";
    if (
      form.newPassword &&
      form.confirmNewPassword &&
      form.newPassword !== form.confirmNewPassword
    ) {
      currentErrors.confirmNewPassword = "Passwords do not match.";
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
    setSuccess("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (!value) {
      if (name === "currentPassword")
        errorMsg = "Current password is required.";
      if (name === "newPassword") errorMsg = "New password is required.";
      if (name === "confirmNewPassword")
        errorMsg = "Please confirm your new password.";
    }
    if (
      name === "confirmNewPassword" &&
      form.newPassword &&
      value &&
      form.newPassword !== value
    ) {
      errorMsg = "Passwords do not match.";
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post(
        "/auth/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { withCredentials: true }
      );

      setSuccess(res.data.message);
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      console.error("Change password error:", err.response?.data || err);
      setServerError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } focus:shadow-outline`;

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center pt-6">
        <form
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">
            Change Password
          </h2>

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

          <div>
            <label
              htmlFor="currentPassword"
              className="block text-gray-700 font-bold mb-1"
            >
              Current Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-bold mb-1"
            >
              New Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 font-bold mb-1"
            >
              Confirm New Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              placeholder="Confirm New Password"
              value={form.confirmNewPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("confirmNewPassword")}
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;