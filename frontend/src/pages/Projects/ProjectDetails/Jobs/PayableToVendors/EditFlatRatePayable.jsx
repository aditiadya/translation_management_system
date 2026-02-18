import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../utils/axiosInstance";
import FormInput from "../../../../../components/Form/FormInput";
import FormSelect from "../../../../../components/Form/FormSelect";
import FormTextarea from "../../../../../components/Form/TextArea";
import BackButton from "../../../../../components/Button/BackButton";

const EditFlatRatePayable = () => {
  const navigate = useNavigate();
  const { id: projectId, jobId, payableId } = useParams();

  const [form, setForm] = useState({
    subtotal: "",
    currency_id: "",
    file_id: "",
    note_for_vendor: "",
    internal_note: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);
  const [meta, setMeta] = useState({
    project_code: "",
    project_name: "",
    specialization_name: "",
    client_id: null,
    client_name: "",
    vendor_id: null,
    vendor_name: "",
    job_code: "",
    job_name: "",
    service_name: "",
    language_pair: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [jobRes, payableRes, currenciesRes, filesRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/project-finances/flat-rate-payables/${payableId}`),
          api.get(`/admin-currencies`).catch(() => ({ data: { data: [] } })),
          api.get(`/job-input-files?job_id=${jobId}`).catch(() => ({ data: { data: [] } })),
        ]);

        const job = jobRes.data.data;
        const payable = payableRes.data.data;
        const project = job.project;

        const client = project?.client;
        const clientName = client?.type === "Company"
          ? client.company_name
          : `${client?.primary_user?.first_name || ""} ${client?.primary_user?.last_name || ""}`.trim() || "—";

        const vendor = job.vendor;
        const vendorName = vendor?.type === "Company"
          ? vendor.company_name
          : `${vendor?.primary_users?.first_name || ""} ${vendor?.primary_users?.last_name || ""}`.trim() || "—";

        const languagePair = job.languagePair
          ? `${job.languagePair?.sourceLanguage?.name || "?"} - ${job.languagePair?.targetLanguage?.name || "?"}`
          : "—";

        setMeta({
          project_code: project?.project_code || project?.code || "—",
          project_name: project?.project_name || "—",
          specialization_name: project?.specialization?.name || "—",
          client_id: project?.client_id,
          client_name: clientName,
          vendor_id: job.vendor_id,
          vendor_name: vendorName,
          job_code: job.job_code || job.code || "—",
          job_name: job.name || "—",
          service_name: job.service?.name || "—",
          language_pair: languagePair,
        });

        setForm({
          subtotal: payable.subtotal ? String(payable.subtotal) : "",
          currency_id: payable.currency_id ? String(payable.currency_id) : "",
          file_id: payable.file_id ? String(payable.file_id) : "",
          note_for_vendor: payable.note_for_vendor || "",
          internal_note: payable.internal_note || "",
        });

        setCurrencies(Array.isArray(currenciesRes.data.data) ? currenciesRes.data.data : []);
        setFiles(Array.isArray(filesRes.data.data) ? filesRes.data.data : []);
      } catch (err) {
        console.error("Failed to load data", err);
        setServerError(err.response?.data?.message || "Failed to load form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [projectId, jobId, payableId]);

  const validate = () => {
    const e = {};
    if (!form.subtotal) e.subtotal = "Subtotal is required.";
    if (!form.currency_id) e.currency_id = "Currency is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) setErrors((prev) => ({ ...prev, [name]: "This field is required." }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
    setSuccess("");
  };

  const buildPayload = () => ({
    job_id: Number(jobId),
    client_id: meta.client_id,
    vendor_id: meta.vendor_id,
    subtotal: Number(form.subtotal),
    currency_id: Number(form.currency_id),
    file_id: form.file_id ? Number(form.file_id) : null,
    note_for_vendor: form.note_for_vendor || null,
    internal_note: form.internal_note || null,
  });

  const submit = async () => {
    if (!validate()) return;
    try {
      const res = await api.put(
        `/project-finances/flat-rate-payables/${payableId}`,
        buildPayload()
      );
      setSuccess(res.data.message || "Payable updated successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update payable");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BackButton to={-1} />
        <h1 className="text-2xl font-bold text-gray-900">Edit Flat Rate Payable</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-8 space-y-5">

        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            {[
              { label: "Project",        value: `${meta.project_code} ${meta.project_name}`.trim(), highlight: true },
              { label: "Specialization", value: meta.specialization_name },
              { label: "Client",         value: meta.client_name, highlight: true },
              { label: "Vendor",         value: meta.vendor_name, highlight: true },
              { label: "Job",            value: `${meta.job_code} ${meta.job_name}`.trim(), highlight: true },
              { label: "Service",        value: meta.service_name },
              { label: "Language Pair",  value: meta.language_pair },
            ].map(({ label, value, highlight }) => (
              <tr key={label} className="border-b border-gray-100 last:border-0">
                <td className="py-2 px-4 font-medium text-gray-600 w-40 bg-gray-50">{label}</td>
                <td className={`py-2 px-4 ${highlight ? "text-blue-600" : "text-gray-800"}`}>
                  {value || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1">
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
              label: `${c.currency?.code || c.code || "?"} - ${c.currency?.name || c.name || "?"}`,
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
              label: f.linkedProjectFile?.original_file_name || f.original_file_name || f.file_name || `File #${f.id}`,
            }))}
          />

          <div className="md:col-span-2">
            <FormTextarea
              label="Note (hidden from vendor)"
              name="internal_note"
              value={form.internal_note}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              label="Note (visible to vendor)"
              name="note_for_vendor"
              value={form.note_for_vendor}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <span className="text-gray-500 text-sm">
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

        <div className="space-x-4">
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
      </div>
    </div>
  );
};

export default EditFlatRatePayable;