import React, { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Button from "../../../components/Button/Button";
import api from "../../../utils/axiosInstance";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const currentErrors = {};
    if (!email) {
      currentErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      currentErrors.email = "Enter a valid email address.";
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleBlur = () => {
    if (!email) {
      setErrors({ email: "Email is required." });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Enter a valid email address." });
    } else {
      setErrors({});
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({});
    setServerError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post("/auth/request-reset", { email });
      setSuccess(res.data.message);
      setServerError("");
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong");
      setSuccess("");
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
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-5"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Request Password Reset
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
              htmlFor="email"
              className="block text-gray-700 font-bold mb-1"
            >
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-center">
            <Button type="submit">Send Reset Link</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RequestReset;
