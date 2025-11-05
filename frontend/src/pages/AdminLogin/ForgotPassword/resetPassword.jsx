import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Button from "../../../components/Button/Button";
import api from "../../../utils/axiosInstance";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const currentErrors = {};
    if (!form.newPassword)
      currentErrors.newPassword = "New password is required.";
    if (!form.confirmPassword) {
      currentErrors.confirmPassword = "Confirm password is required.";
    } else if (form.newPassword !== form.confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (!value) {
      errorMsg =
        name === "newPassword"
          ? "New password is required."
          : "Confirm password is required.";
    }
    if (name === "confirmPassword" && value !== form.newPassword) {
      errorMsg = "Passwords do not match.";
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: form.newPassword,
      });

      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 2000); // redirect after success
    } catch (err) {
      console.error("Reset error:", err.response?.data || err);
      setServerError(err.response?.data?.error || "Password reset failed");
    }
  };

  const inputClass = (field) =>
    `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } focus:shadow-outline`;

  if (!token) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-red-600 font-semibold text-lg">
            Invalid or expired reset link.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex justify-center items-center p-6">
        <form
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">
            Reset Password
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
              htmlFor="newPassword"
              className="block text-gray-700 font-bold mb-1"
            >
              New Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
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
              htmlFor="confirmPassword"
              className="block text-gray-700 font-bold mb-1"
            >
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;