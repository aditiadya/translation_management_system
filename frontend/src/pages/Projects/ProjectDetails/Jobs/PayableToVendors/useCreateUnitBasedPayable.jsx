import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../utils/axiosInstance";

const useCreateUnitBasedPayable = () => {
  const navigate = useNavigate();
  const { id: projectId, jobId } = useParams(); // ← add jobId

  const [form, setForm] = useState({
    unit_amount: "",
    unit_id: "",
    price_per_unit: "",
    subtotal: "",
    currency_id: "",
    file_id: "",
    note_for_vendor: "",
    internal_note: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const [units, setUnits] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

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

  /* ================= Fetch initial data ================= */

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setServerError("");

        const [jobRes, unitsRes, currenciesRes, filesRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/admin-units`).catch(() => ({ data: { data: [] } })),
          api.get(`/admin-currencies`).catch(() => ({ data: { data: [] } })),
          api.get(`/job-input-files?job_id=${jobId}`).catch(() => ({ data: { data: [] } })),
        ]);

        const job = jobRes.data.data;
        const project = job.project;

        // Client name
        const client = project?.client;
        const clientName = client?.type === "Company"
          ? client.company_name
          : `${client?.primary_user?.first_name || ""} ${client?.primary_user?.last_name || ""}`.trim() || "—";

        // Vendor name
        const vendor = job.vendor;
        const vendorName = vendor?.type === "Company"
          ? vendor.company_name
          : `${vendor?.primary_users?.first_name || ""} ${vendor?.primary_users?.last_name || ""}`.trim() || "—";

        // Language pair
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

        setUnits(Array.isArray(unitsRes.data.data) ? unitsRes.data.data : []);
        setCurrencies(Array.isArray(currenciesRes.data.data) ? currenciesRes.data.data : []);
        setFiles(Array.isArray(filesRes.data.data) ? filesRes.data.data : []);

        // Fetch vendor prices using vendor_id from job
        if (job.vendor_id) {
          const pricesRes = await api
            .get(`/vendor-price-list?vendor_id=${job.vendor_id}`)
            .catch(() => ({ data: { data: [] } }));

          const priceData = Array.isArray(pricesRes.data.data) ? pricesRes.data.data : [];
          setPrices(priceData.map((row) => ({ ...row, isMatching: false })));
        }
      } catch (err) {
        console.error("Failed to load form data", err);
        setServerError(err.response?.data?.message || "Failed to load form data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [projectId, jobId]);

  /* ================= Re-match prices when unit changes ================= */

  useEffect(() => {
    if (!prices.length) return;
    setPrices((prev) =>
      prev.map((row) => ({
        ...row,
        isMatching: !form.unit_id || row.unit_id === Number(form.unit_id),
      }))
    );
  }, [form.unit_id]);

  /* ================= Auto-calculate subtotal ================= */

  useEffect(() => {
    const amount = parseFloat(form.unit_amount);
    const price = parseFloat(form.price_per_unit);
    if (!isNaN(amount) && !isNaN(price)) {
      setForm((prev) => ({ ...prev, subtotal: (amount * price).toFixed(2) }));
    } else {
      setForm((prev) => ({ ...prev, subtotal: "" }));
    }
  }, [form.unit_amount, form.price_per_unit]);

  /* ================= Price row click ================= */

  const handlePriceSelect = (row) => {
    setSelectedPriceId(row.id);
    setForm((prev) => ({
      ...prev,
      unit_id: row.unit_id ? String(row.unit_id) : prev.unit_id,
      price_per_unit: row.price_per_unit ? String(row.price_per_unit) : prev.price_per_unit,
      currency_id: row.currency?.id ? String(row.currency.id) : prev.currency_id,
    }));
  };

  /* ================= Validation ================= */

  const validate = () => {
    const e = {};
    if (!form.unit_amount) e.unit_amount = "Unit amount is required.";
    if (!form.unit_id) e.unit_id = "Unit is required.";
    if (!form.price_per_unit) e.price_per_unit = "Price per unit is required.";
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
    project_id: Number(projectId),
    job_id: Number(jobId),
    client_id: meta.client_id,
    vendor_id: meta.vendor_id,
    unit_amount: Number(form.unit_amount),
    unit_id: Number(form.unit_id),
    price_per_unit: Number(form.price_per_unit),
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
      const res = await api.post("/project-finances/unit-based-payables", payload);
      setSuccess(res.data.message || "Payable created successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to create payable");
    }
  };

  return {
    projectId,
    jobId,
    form,
    errors,
    serverError,
    success,
    units,
    currencies,
    files,
    prices,
    selectedPriceId,
    meta,
    loading,
    handleChange,
    handleBlur,
    handlePriceSelect,
    submit,
    navigate,
  };
};

export default useCreateUnitBasedPayable;