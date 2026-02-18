import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";
import FormInput from "../../../../components/Form/FormInput";
import FormSelect from "../../../../components/Form/FormSelect";
import FormTextarea from "../../../../components/Form/TextArea";
import BackButton from "../../../../components/Button/BackButton";

const EditFlatRateReceivable = () => {
  const navigate = useNavigate();
  const { id: projectId, receivableId } = useParams(); // route: /project/:id/edit-flat-rate-receivable/:receivableId

  const [form, setForm] = useState({
    po_number: "",
    service_id: "",
    language_pair_id: "",
    subtotal: "",
    currency_id: "",
    file_id: "",
    internal_note: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [services, setServices] = useState([]);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);

  const [projectMeta, setProjectMeta] = useState({
    client_id: null,
    client_name: "",
    specialization_name: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= Fetch existing receivable + dropdowns ================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setServerError("");

        // Fetch project + existing receivable in parallel
        const [projectRes, receivableRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/project-finances/flat-rate-receivables/${receivableId}`),
        ]);

        const projectData = projectRes.data.data;
        const receivable = receivableRes.data.data;
        const clientId = projectData.client_id;

        const clientName =
          projectData.client?.company_name ||
          `${projectData.client?.primary_user?.first_name || ""} ${
            projectData.client?.primary_user?.last_name || ""
          }`.trim() ||
          "—";

        setProjectMeta({
          client_id: clientId,
          client_name: clientName,
          specialization_name: projectData.specialization?.name || "—",
        });

        // Pre-fill form with existing values
        setForm({
          po_number: receivable.po_number || "",
          service_id: receivable.service_id ? String(receivable.service_id) : "",
          language_pair_id: receivable.language_pair_id ? String(receivable.language_pair_id) : "",
          subtotal: receivable.subtotal ? String(receivable.subtotal) : "",
          currency_id: receivable.currency_id ? String(receivable.currency_id) : "",
          file_id: receivable.file_id ? String(receivable.file_id) : "",
          internal_note: receivable.internal_note || "",
        });

        // Fetch dropdowns in parallel
        const [s, l, c, f] = await Promise.all([
          api.get(`/client-price-list/client/${clientId}/services`).catch(() => ({ data: { data: [] } })),
          api.get(`/client-price-list/client/${clientId}/language-pairs`).catch(() => ({ data: { data: [] } })),
          api.get(`/client-price-list/client/${clientId}/currencies`).catch(() => ({ data: { data: [] } })),
          api.get(`/client/${clientId}/input-files`).catch(() => ({ data: { data: [] } })),
        ]);

        setServices(Array.isArray(s.data.data) ? s.data.data : []);
        setLanguagePairs(Array.isArray(l.data.data) ? l.data.data : []);
        setCurrencies(Array.isArray(c.data.data) ? c.data.data : []);
        setFiles(Array.isArray(f.data.data) ? f.data.data : []);
      } catch (err) {
        console.error("Failed to load data", err);
        setServerError(err.response?.data?.message || "Failed to load form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [projectId, receivableId]);

  /* ================= Dynamic currency filtering ================= */

  useEffect(() => {
    const fetchFilteredCurrencies = async () => {
      if (!projectMeta.client_id) return;
      if (!form.service_id && !form.language_pair_id) return;

      try {
        const params = new URLSearchParams();
        if (form.service_id) params.append("service_id", form.service_id);
        if (form.language_pair_id) params.append("language_pair_id", form.language_pair_id);

        const res = await api.get(
          `/client-price-list/client/${projectMeta.client_id}/currencies?${params}`
        );

        const currenciesData = Array.isArray(res.data.data) ? res.data.data : [];
        setCurrencies(currenciesData);

        if (form.currency_id) {
          const exists = currenciesData.some((c) => c.id === Number(form.currency_id));
          if (!exists) setForm((prev) => ({ ...prev, currency_id: "" }));
        }
      } catch (err) {
        console.error("Failed to load filtered currencies", err);
      }
    };

    fetchFilteredCurrencies();
  }, [form.service_id, form.language_pair_id, projectMeta.client_id]);

  /* ================= Validation ================= */

  const validate = () => {
    const e = {};
    if (!form.service_id) e.service_id = "Service is required.";
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
    po_number: form.po_number || null,
    service_id: Number(form.service_id),
    language_pair_id: form.language_pair_id ? Number(form.language_pair_id) : null,
    subtotal: Number(form.subtotal),
    currency_id: Number(form.currency_id),
    file_id: form.file_id ? Number(form.file_id) : null,
    internal_note: form.internal_note || null,
  });

  /* ================= Submit ================= */

  const submit = async () => {
    if (!validate()) return;

    try {
      const payload = buildPayload();
      const res = await api.put(
        `/project-finances/flat-rate-receivables/${receivableId}`,
        payload
      );

      setSuccess(res.data.message || "Receivable updated successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update receivable");
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
            Edit Flat Rate Receivable
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
            <FormInput
              label="PO Number"
              name="po_number"
              value={form.po_number}
              onChange={handleChange}
              error={errors.po_number}
            />

            <FormSelect
              label="Service"
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              onBlur={handleBlur}
              options={services.map((s) => ({ value: s.id, label: s.name }))}
              error={errors.service_id}
              required
            />

            <FormSelect
              label="Language Pair"
              name="language_pair_id"
              value={form.language_pair_id}
              onChange={handleChange}
              options={languagePairs.map((l) => ({
                value: l.id,
                label: `${l.sourceLanguage?.name || "?"} → ${l.targetLanguage?.name || "?"}`,
              }))}
              error={errors.language_pair_id}
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
            />

            <div className="md:col-span-2">
              <FormTextarea
                label="Internal Note"
                name="internal_note"
                value={form.internal_note}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
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

export default EditFlatRateReceivable;