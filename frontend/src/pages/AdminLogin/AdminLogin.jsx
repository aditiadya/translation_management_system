import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const currentErrors = {};
    if (!form.email) currentErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      currentErrors.email = "Email is invalid.";
    if (!form.password) currentErrors.password = "Password is required.";
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (name === "email") {
      if (!value) errorMsg = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "Email is invalid.";
    } else if (name === "password") {
      if (!value) errorMsg = "Password is required.";
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
      const response = await api.post("/auth/login", form);
      setUser(response.data.user); 
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.error || "Login failed");
    }
  };

  const inputClass = (field) =>
    `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } focus:shadow-outline`;

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
            Admin Login
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
            <label htmlFor="email" className="block text-gray-700 font-bold mb-1">
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
            <label htmlFor="password" className="block text-gray-700 font-bold mb-1">
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

          <div className="flex justify-center">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
