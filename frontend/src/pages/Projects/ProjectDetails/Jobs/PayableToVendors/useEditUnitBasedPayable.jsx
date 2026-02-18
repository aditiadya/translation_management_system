import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../utils/axiosInstance";

const useEditUnitBasedPayable = () => {
  const navigate = useNavigate();
  const { id: projectId, payableId } = useParams();

  const [form, setForm] = useState({
    job_id: "",
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

  const [jobs, setJobs] = useState([]);
  const [units, setUnits] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

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

        const [projectRes, payableRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/project-finances/unit-based-payables/${payableId}`),
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
          unit_amount: payable.unit_amount ? String(payable.unit_amount) : "",
          unit_id: payable.unit_id ? String(payable.unit_id) : "",
          price_per_unit: payable.price_per_unit ? String(payable.price_per_unit) : "",
          subtotal: payable.subtotal ? String(payable.subtotal) : "",
          currency_id: payable.currency_id ? String(payable.currency_id) : "",
          file_id: payable.file_id ? String(payable.file_id) : "",
          note_for_vendor: payable.note_for_vendor || "",
          internal_note: payable.internal_note || "",
        });

        // Fetch jobs, units, currencies in parallel
        const [jobsRes, unitsRes, currenciesRes] = await Promise.all([
          api.get(`/jobs?project_id=${projectId}`).catch(() => ({ data: { data: [] } })),
          api.get(`/admin-units`).catch(() => ({ data: { data: [] } })),
          api.get(`/currencies`).catch(() => ({ data: { data: [] } })),
        ]);

        setJobs(Array.isArray(jobsRes.data.data) ? jobsRes.data.data : []);
        setUnits(Array.isArray(unitsRes.data.data) ? unitsRes.data.data : []);
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
    // Skip during initial load — handled in fetchAll above
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

        // Reset file only if it no longer belongs to the new job
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

  /* ================= Fetch vendor prices when job/unit changes ================= */

  useEffect(() => {
    const fetchPrices = async () => {
      if (!form.job_id) {
        setPrices([]);
        return;
      }

      try {
        const jobRes = await api
          .get(`/jobs/${form.job_id}`)
          .catch(() => ({ data: { data: null } }));

        const job = jobRes.data.data;
        if (!job?.vendor_id) {
          setPrices([]);
          return;
        }

        const params = new URLSearchParams();
        params.append("vendor_id", job.vendor_id);
        if (form.unit_id) params.append("unit_id", form.unit_id);

        const res = await api
          .get(`/vendor-price-list?${params}`)
          .catch(() => ({ data: { data: [] } }));

        const data = Array.isArray(res.data.data) ? res.data.data : [];

        const marked = data.map((row) => ({
          ...row,
          isMatching: !form.unit_id || row.unit_id === Number(form.unit_id),
        }));

        marked.sort((a, b) => (b.isMatching ? 1 : 0) - (a.isMatching ? 1 : 0));
        setPrices(marked);
      } catch (err) {
        console.error("Failed to load vendor prices", err);
      }
    };

    fetchPrices();
  }, [form.job_id, form.unit_id]);

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
      currency_id: row.currency_id ? String(row.currency_id) : prev.currency_id,
    }));
  };

  /* ================= Validation ================= */

  const validate = () => {
    const e = {};
    if (!form.job_id) e.job_id = "Job is required.";
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
      const res = await api.put(
        `/project-finances/unit-based-payables/${payableId}`,
        payload
      );

      setSuccess(res.data.message || "Payable updated successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update payable");
    }
  };

  return {
    projectId,
    form,
    errors,
    serverError,
    success,
    jobs,
    units,
    currencies,
    files,
    prices,
    selectedPriceId,
    projectMeta,
    loading,
    handleChange,
    handleBlur,
    handlePriceSelect,
    submit,
    navigate,
  };
};

export default useEditUnitBasedPayable;