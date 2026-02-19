import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import { AuthContext } from "../../../context/AuthContext";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import CheckboxField from "../../../components/Form/CheckboxField";
import { getTimezonesWithOffset } from "../../../utils/constants/timezones";

const staticTimezones = getTimezonesWithOffset();

const CreateManagerForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    role_id: "",
    client_pool_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    teams_id: "",
    zoom_id: "",
    timezone: "",
    can_login: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [clientPools, setClientPools] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchClientPools = async () => {
      try {
        const res = await api.get("/client-pools", { withCredentials: true });
        const pools = res.data.data.filter((pool) => pool.admin_id === user.id);
        setClientPools(pools);
      } catch (err) {
        console.error("Failed to fetch client pools:", err.response || err);
      }
    };

    fetchClientPools();
  }, [user.id]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/manager-roles", { withCredentials: true });
        setRoles(res.data.data);
      } catch (err) {
        console.error("Failed to fetch roles:", err.response || err);
      }
    };

    fetchRoles();
  }, []);

  const validate = () => {
    const currentErrors = {};
    if (!form.role_id) currentErrors.role_id = "Role is required.";
    if (!form.first_name) currentErrors.first_name = "First name is required.";
    if (!form.last_name) currentErrors.last_name = "Last name is required.";
    if (!form.email) currentErrors.email = "Email is required.";
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = "";
    if (
      ["role_id", "first_name", "last_name", "email"].includes(name) &&
      !value
    ) {
      errorMsg =
        name === "role_id"
          ? "Role is required."
          : name === "email"
          ? "Email is required."
          : `${name.replace("_", " ")} is required.`;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({ ...errors, [name]: "" });
    setServerError("");
    setSuccess("");
  };

  const formatFormData = () => {
    const f = { ...form };

    if (f.client_pool_id === "") f.client_pool_id = null;
    else f.client_pool_id = Number(f.client_pool_id);

    if (f.role_id !== "") f.role_id = Number(f.role_id);

    return f;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = formatFormData();

      const response = await api.post("/managers", payload, {
        withCredentials: true,
      });

      setSuccess(response.data.message);
      navigate("/managers");
      setServerError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setServerError(
        err.response?.data?.message ||
          "Something went wrong while creating manager."
      );
      setSuccess("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white shadow rounded-lg p-8 space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
        <div>
          <FormSelect
            label="Role"
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            onBlur={handleBlur}
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
            error={errors.role_id}
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/system-roles")}
              className="text-blue-600 underline text-sm hover:text-blue-800 transition"
            >
              System roles and access permissions
            </button>
          </div>
        </div>

        <FormSelect
          label="Client Pool"
          name="client_pool_id"
          value={form.client_pool_id}
          onChange={handleChange}
          onBlur={handleBlur}
          options={clientPools.map((pool) => ({
            value: pool.id,
            label: pool.name,
          }))}
          error={errors.client_pool_id}
        />

        <FormInput
          label="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.first_name}
          required
        />

        <FormInput
          label="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.last_name}
          required
        />

        <FormSelect
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          options={["Male", "Female", "Other"]}
          error={errors.gender}
        />

        <FormInput
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          type="email"
          required
        />

        <FormInput
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <FormInput
          label="Teams ID"
          name="teams_id"
          value={form.teams_id}
          onChange={handleChange}
          error={errors.teams_id}
        />

        <FormInput
          label="Zoom ID"
          name="zoom_id"
          value={form.zoom_id}
          onChange={handleChange}
          error={errors.zoom_id}
        />

        <FormSelect
          label="Timezone"
          name="timezone"
          value={form.timezone}
          onChange={handleChange}
          options={staticTimezones}
          error={errors.timezone}
        />
      </div>

      <CheckboxField
        label="Can Login"
        name="can_login"
        checked={form.can_login}
        onChange={handleChange}
        hint={
          <span className="text-gray-500 text-sm mt-1">
            Fields marked with <span className="text-red-600">*</span> are
            mandatory.
          </span>
        }
      />

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

      <div className="mt-4 space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => navigate("/managers")}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateManagerForm;