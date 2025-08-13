import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegistration = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    account_type: "",
    company_name: "",
    country: "",
    time_zone: "",
    first_name: "",
    last_name: "",
    username: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // Full form validation, runs on submit
  const validate = () => {
    const currentErrors = {};

    if (!form.email) currentErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      currentErrors.email = "Email is invalid.";

    if (!form.password) currentErrors.password = "Password is required.";
    else if (form.password.length <= 8)
      currentErrors.password = "Password must be more than 8 characters";

    if (!form.account_type)
      currentErrors.account_type = "Account type is required.";
    if (!form.company_name)
      currentErrors.company_name = "Company name is required.";
    if (!form.country) currentErrors.country = "Country is required.";
    if (!form.time_zone) currentErrors.time_zone = "Time zone is required.";
    if (!form.first_name) currentErrors.first_name = "First name is required.";
    if (!form.last_name) currentErrors.last_name = "Last name is required.";
    if (!form.username) currentErrors.username = "Username is required.";
    if (!form.phone) currentErrors.phone = "Phone is required.";
    else if (!/^\+?[0-9\s\-]{7,15}$/.test(form.phone))
      currentErrors.phone = "Phone number is invalid.";

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  // Single field validation, runs on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (name === "email") {
      if (!value) errorMsg = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Email is invalid.";
    } else if (name === "password") {
      if (!value) errorMsg = "Password is required.";
      else if (value.length <= 8)
        errorMsg = "Password must be more than 8 characters";
    } else if (name === "account_type") {
      if (!value) errorMsg = "Account type is required.";
    } else if (name === "company_name") {
      if (!value) errorMsg = "Company name is required.";
    } else if (name === "country") {
      if (!value) errorMsg = "Country is required.";
    } else if (name === "time_zone") {
      if (!value) errorMsg = "Time zone is required.";
    } else if (name === "first_name") {
      if (!value) errorMsg = "First name is required.";
    } else if (name === "last_name") {
      if (!value) errorMsg = "Last name is required.";
    } else if (name === "username") {
      if (!value) errorMsg = "Username is required.";
    } else if (name === "phone") {
      if (!value) errorMsg = "Phone is required.";
      else if (!/^\+?[0-9\s\-]{7,15}$/.test(value))
        errorMsg = "Phone number is invalid.";
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      setSuccess(response.data.message);
      setServerError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setSuccess("");
      setServerError(
        err.response?.data?.error || "Failed to register. Please try again."
      );
    }
  };

  const inputClass = (field) =>
    `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } focus:shadow-outline`;

  const labelClass = "block text-gray-700 font-bold mb-1";

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
            Create Admin Account
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
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="account_type" className={labelClass}>
              Account Type <span className="text-red-600">*</span>
            </label>
            <select
              id="account_type"
              name="account_type"
              value={form.account_type}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("account_type")}
            >
              <option value="" disabled>
                Select account type...
              </option>
              <option value="freelance">Freelance</option>
              <option value="enterprise">Enterprise</option>
            </select>
            {errors.account_type && (
              <p className="text-red-500 text-sm mt-1">{errors.account_type}</p>
            )}
          </div>

          <div>
            <label htmlFor="company_name" className={labelClass}>
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              placeholder="Company Name"
              value={form.company_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("company_name")}
            />
            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className={labelClass}>
              Country <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="country"
              id="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("country")}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div>
            <label htmlFor="time_zone" className={labelClass}>
              Time Zone <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="time_zone"
              id="time_zone"
              placeholder="Time Zone"
              value={form.time_zone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("time_zone")}
            />
            {errors.time_zone && (
              <p className="text-red-500 text-sm mt-1">{errors.time_zone}</p>
            )}
          </div>

          <div>
            <label htmlFor="first_name" className={labelClass}>
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("first_name")}
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className={labelClass}>
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("last_name")}
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className={labelClass}>
              Username <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit">Sign Up</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminRegistration;
