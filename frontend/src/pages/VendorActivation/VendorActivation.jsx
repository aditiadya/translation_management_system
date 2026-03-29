import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import FormInput from "../../components/Form/FormInput";
import FormSelect from "../../components/Form/FormSelect";
import { getTimezonesWithOffset } from "../../utils/constants/timezones";
import { AuthContext } from "../../context/AuthContext";

export default function VendorActivation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirm_password: "",
    timezone: "",
  });

  const [prefilled, setPrefilled] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const timezones = getTimezonesWithOffset();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await api.get(`/vendor/activate/${token}/verify`);
        if (res.data?.is_active) {
          setIsActive("active");
        } else {
          setIsActive("valid");
          // Set pre-filled data
          const prefill = res.data?.pre_filled || {};
          setPrefilled(prefill);
          setForm((prev) => ({
            ...prev,
            first_name: prefill.first_name || "",
            last_name: prefill.last_name || "",
            timezone: prefill.timezone || "",
          }));
        }
      } catch (err) {
        setIsActive("invalid");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const validateUsernameRules = (username) => {
    const errors = [];
    if (username.length < 6) {
      errors.push("Minimum 6 characters required.");
    }
    if (!/^[A-Za-z0-9.]+$/.test(username)) {
      errors.push("Allowed characters: English letter, number and dot (.)");
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let message = "";

    if (!value.trim()) {
      message = `${name.replace(/_/g, " ").charAt(0).toUpperCase() + name.replace(/_/g, " ").slice(1)} is required`;
    } else if (name === "username") {
      const basicPattern = /^[A-Za-z0-9.]+$/;
      if (value.length < 6) {
        message = "Username must be at least 6 characters";
      } else if (!basicPattern.test(value)) {
        message = "Only letters, numbers, and dots are allowed";
      }
    } else if (name === "password" && value.length < 8) {
      message = "Password must be at least 8 characters";
    } else if (name === "confirm_password" && value !== form.password) {
      message = "Passwords do not match";
    }

    setFieldErrors({ ...fieldErrors, [name]: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    const errors = {};

    if (!form.first_name.trim()) {
      errors.first_name = "First name is required";
    }
    if (!form.last_name.trim()) {
      errors.last_name = "Last name is required";
    }
    if (!form.username.trim()) {
      errors.username = "Username is required";
    } else if (form.username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    } else if (!/^[A-Za-z0-9.]+$/.test(form.username)) {
      errors.username = "Username can only contain letters, numbers, and dots";
    }
    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!form.confirm_password) {
      errors.confirm_password = "Confirm password is required";
    } else if (form.password !== form.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }
    if (!form.timezone) {
      errors.timezone = "Timezone is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await api.post(`/vendor/activate/${token}`, {
        username: form.username,
        password: form.password,
        confirm_password: form.confirm_password,
        first_name: form.first_name,
        last_name: form.last_name,
        timezone: form.timezone,
      });

      // Get the logged-in user data
      const meRes = await api.get("/auth/me", { withCredentials: true });
      setUser(meRes.data);

      setSuccess(res.data.message || "Account activated successfully");
      // Redirect to homepage instead of non-existent /vendor/login
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.errors?.[0]?.msg ||
        "Something went wrong. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (isActive === "invalid") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Invalid or Expired Link</h2>
          <p className="mb-6 text-gray-600">
            This activation link is no longer valid. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (isActive === "active") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Account Already Activated</h2>
          <p className="mb-6 text-gray-600">Your account is already active. Please login.</p>
          <button
            onClick={() => navigate("/vendor/login")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Vendor Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Activate Your Vendor Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Complete the form below to activate your account
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <FormInput
              label="First Name *"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.first_name}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <FormInput
              label="Last Name *"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.last_name}
              required
            />
          </div>

          {/* Timezone */}
          <div className="md:col-span-2">
            <FormSelect
              label="Timezone *"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              onBlur={handleBlur}
              options={timezones}
              error={fieldErrors.timezone}
              required
            />
          </div>

          {/* Username */}
          <div className="md:col-span-2">
            <FormInput
              label="Username *"
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.username}
              required
            />

            {/* Username Rules */}
            {form.username.length > 0 && (
              <div className="mt-2 text-sm">
                {validateUsernameRules(form.username).length === 0 ? (
                  <p className="text-green-600">✓ Username looks good</p>
                ) : (
                  <ul className="text-red-600 list-disc ml-4">
                    {validateUsernameRules(form.username).map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <FormInput
              label="Password *"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.password}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <FormInput
              label="Confirm Password *"
              name="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={fieldErrors.confirm_password}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-6"
        >
          Activate Account
        </button>
      </form>
    </div>
  );
}
