import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

export default function AccountActivation() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await api.get(`/auth/activate/${token}/verify`);
        if (res.data?.is_active) {
          setIsActive("active");
        } else {
          setIsActive("valid");
        }
      } catch (err) {
        setIsActive("invalid");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let message = "";

    if (!value.trim()) {
      message = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === "password" && value.length < 6) {
      message = "Password must be at least 6 characters";
    } else if (name === "confirmPassword" && value !== form.password) {
      message = "Passwords do not match";
    }

    setFieldErrors({ ...fieldErrors, [name]: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post(`/auth/activate/${token}`, {
        username: form.username,
        password: form.password,
      });

      setSuccess(res.data.message || "Account activated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isActive === "invalid") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Invalid or Expired Link</h2>
          <p className="mb-6">
            This activation link is no longer valid. Please request a new one.
          </p>
        </div>
      </div>
    );
  }

  if (isActive === "active") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Account Already Activated</h2>
          <p className="mb-6">Your account is already active. Please login.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Activate Your Account
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded-lg p-2"
            required
          />
          {fieldErrors.username && (
            <p className="text-red-600 text-sm">{fieldErrors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded-lg p-2"
            required
          />
          {fieldErrors.password && (
            <p className="text-red-600 text-sm">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border rounded-lg p-2"
            required
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-600 text-sm">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Activate Account
        </button>
      </form>
    </div>
  );
}