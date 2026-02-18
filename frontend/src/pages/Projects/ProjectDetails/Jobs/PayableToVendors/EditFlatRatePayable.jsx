import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../utils/axiosInstance";
import FormInput from "../../../../../components/Form/FormInput";
import FormSelect from "../../../../../components/Form/FormSelect";
import FormTextarea from "../../../../../components/Form/TextArea";
import BackButton from "../../../../../components/Button/BackButton";

const EditFlatRatePayable = () => {
  const navigate = useNavigate();
  const { id: projectId, payableId } = useParams(); // route: /project/:id/edit-flat-rate-payable/:payableId

  const [form, setForm] = useState({
    job_id: "",
    subtotal: "",
    currency_id: "",
    file_id: "",
    note_for_vendor: "",
    internal_note: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [jobs, setJobs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);

  const [projectMeta, setProjectMeta] = useState({
    client_name: "",
    specialization_name: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= Fetch existing payable + dropdowns ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setServerError("");

        // Fetch project + existing payable in parallel
        const [projectRes, payableRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/project-finances/flat-rate-payables/${payableId}`),
        ]);

        const projectData = projectRes.data.data;
        const payable = payableRes.data.data;

        const clientName =
          projectData.client?.company_name ||
          `${projectData.client?.primary_user?.first_name || ""} ${
            projectData.client?.primary_user?.last_name || ""
          }`.trim() ||
          "—";

        setProjectMeta({
          client_name: clientName,
          specialization_name: projectData.specialization?.name || "—",
        });

        // Pre-fill form with existing values
        setForm({
          job_id: payable.job_id ? String(payable.job_id) : "",
          subtotal: payable.subtotal ? String(payable.subtotal) : "",
          currency_id: payable.currency_id ? String(payable.currency_id) : "",
          file_id: payable.file_id ? String(payable.file_id) : "",
          note_for_vendor: payable.note_for_vendor || "",
          internal_note: payable.internal_note || "",
        });

        // Fetch jobs and currencies in parallel
        const [jobsRes, currenciesRes] = await Promise.all([
          api.get(`/jobs?project_id=${projectId}`).catch(() => ({ data: { data: [] } })),
          api.get(`/currencies`).catch(() => ({ data: { data: [] } })),
        ]);

        setJobs(Array.isArray(jobsRes.data.data) ? jobsRes.data.data : []);
        setCurrencies(Array.isArray(currenciesRes.data.data) ? currenciesRes.data.data : []);

        // Fetch files for the pre-existing job
        if (payable.job_id) {
          const filesRes = await api
            .get(`/jobs/${payable.job_id}/input-files`)
            .catch(() => ({ data: { data: [] } }));
          setFiles(Array.isArray(filesRes.data.data) ? filesRes.data.data : []);
        }
      } catch (err) {
        console.error("Failed to load data", err);
        setServerError(err.response?.data?.message || "Failed to load form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [projectId, payableId]);

  /* ================= Fetch files when job changes ================= */

  useEffect(() => {
    // Skip on initial mount — files for the existing job are fetched above
    if (loading) return;

    const fetchJobFiles = async () => {
      if (!form.job_id) {
        setFiles([]);
        setForm((prev) => ({ ...prev, file_id: "" }));
        return;
      }

      try {
        const res = await api
          .get(`/jobs/${form.job_id}/input-files`)
          .catch(() => ({ data: { data: [] } }));
        const filesData = Array.isArray(res.data.data) ? res.data.data : [];
        setFiles(filesData);

        // Reset file if it no longer belongs to the new job
        setForm((prev) => {
          const fileStillValid = filesData.some((f) => f.id === Number(prev.file_id));
          return fileStillValid ? prev : { ...prev, file_id: "" };
        });
      } catch (err) {
        console.error("Failed to load job files", err);
      }
    };

    fetchJobFiles();
  }, [form.job_id]);

  /* ================= Validation ================= */

  const validate = () => {
    const e = {};
    if (!form.job_id) e.job_id = "Job is required.";
    if (!form.subtotal) e.subtotal = "Subtotal is required.";
    if (!form.currency_id) e.currency_id = "Currency is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) setErrors((prev) => ({ ...prev, [name]: "This field is required." }));
  };

  /* ================= Handlers ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
    setSuccess("");
  };

  const buildPayload = () => ({
    job_id: Number(form.job_id),
    subtotal: Number(form.subtotal),
    currency_id: Number(form.currency_id),
    file_id: form.file_id ? Number(form.file_id) : null,
    note_for_vendor: form.note_for_vendor || null,
    internal_note: form.internal_note || null,
  });

  /* ================= Submit ================= */

  const submit = async () => {
    if (!validate()) return;

    try {
      const payload = buildPayload();
      const res = await api.put(
        `/project-finances/flat-rate-payables/${payableId}`,
        payload
      );

      setSuccess(res.data.message || "Payable updated successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update payable");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-5">
          <BackButton to={`/project/${projectId}?tab=finances`} />
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Flat Rate Payable
          </h1>
        </div>

        <form className="bg-white shadow rounded-lg p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Project Client</p>
              <p className="text-gray-900 font-medium">{projectMeta.client_name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Project Specialization</p>
              <p className="text-gray-900 font-medium">{projectMeta.specialization_name}</p>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
            <FormSelect
              label="Job"
              name="job_id"
              value={form.job_id}
              onChange={handleChange}
              onBlur={handleBlur}
              options={jobs.map((j) => ({ value: j.id, label: j.job_name }))}
              error={errors.job_id}
              required
            />

            <FormInput
              label="Subtotal"
              name="subtotal"
              type="number"
              step="0.01"
              value={form.subtotal}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.subtotal}
              required
            />

            <FormSelect
              label="Currency"
              name="currency_id"
              value={form.currency_id}
              onChange={handleChange}
              onBlur={handleBlur}
              options={currencies.map((c) => ({
                value: c.id,
                label: `${c.currency?.code || "?"} (${c.currency?.symbol || "?"})`,
              }))}
              error={errors.currency_id}
              required
            />

            <FormSelect
              label="File"
              name="file_id"
              value={form.file_id}
              onChange={handleChange}
              options={files.map((f) => ({
                value: f.id,
                label: f.original_file_name || f.file_name,
              }))}
              disabled={!form.job_id}
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Note for Vendor"
                name="note_for_vendor"
                value={form.note_for_vendor}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <FormTextarea
                label="Internal Note"
                name="internal_note"
                value={form.internal_note}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                error={errors.internal_note}
              />
            </div>
          </div>

          <span className="text-gray-500 text-sm mt-1">
            Fields marked with <span className="text-red-600">*</span> are mandatory.
          </span>

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
              type="button"
              onClick={submit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditFlatRatePayable;