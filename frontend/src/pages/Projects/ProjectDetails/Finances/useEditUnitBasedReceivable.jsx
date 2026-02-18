import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";

const useEditUnitBasedReceivable = () => {
  const navigate = useNavigate();
  const { id: projectId, receivableId } = useParams();

  const [form, setForm] = useState({
    po_number: "",
    service_id: "",
    language_pair_id: "",
    unit_amount: "",
    unit_id: "",
    price_per_unit: "",
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
  const [units, setUnits] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

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

        const [projectRes, receivableRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/project-finances/unit-based-receivables/${receivableId}`),
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
          unit_amount: receivable.unit_amount ? String(receivable.unit_amount) : "",
          unit_id: receivable.unit_id ? String(receivable.unit_id) : "",
          price_per_unit: receivable.price_per_unit ? String(receivable.price_per_unit) : "",
          subtotal: receivable.subtotal ? String(receivable.subtotal) : "",
          currency_id: receivable.currency_id ? String(receivable.currency_id) : "",
          file_id: receivable.file_id ? String(receivable.file_id) : "",
          internal_note: receivable.internal_note || "",
        });

        // Fetch dropdowns in parallel
        const [s, l, u, c, f] = await Promise.all([
          api.get(`/client-price-list/client/${clientId}/services`).catch(() => ({ data: { data: [] } })),
          api.get(`/client-price-list/client/${clientId}/language-pairs`).catch(() => ({ data: { data: [] } })),
          api.get(`/admin-units`).catch(() => ({ data: { data: [] } })),
          api.get(`/client-price-list/client/${clientId}/currencies`).catch(() => ({ data: { data: [] } })),
          api.get(`/client/${clientId}/input-files`).catch(() => ({ data: { data: [] } })),
        ]);

        setServices(Array.isArray(s.data.data) ? s.data.data : []);
        setLanguagePairs(Array.isArray(l.data.data) ? l.data.data : []);
        setUnits(Array.isArray(u.data.data) ? u.data.data : []);
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

  /* ================= Fetch relevant prices ================= */

  useEffect(() => {
    const fetchPrices = async () => {
      if (!projectMeta.client_id) return;

      try {
        const params = new URLSearchParams();
        params.append("client_id", projectMeta.client_id);
        if (form.service_id) params.append("service_id", form.service_id);
        if (form.language_pair_id) params.append("language_pair_id", form.language_pair_id);

        const res = await api.get(`/client-price-list?${params}`);
        const data = Array.isArray(res.data.data) ? res.data.data : [];

        // Mark matching rows (same service + language pair)
        const marked = data.map((row) => ({
          ...row,
          isMatching:
            String(row.service_id) === String(form.service_id) &&
            String(row.language_pair_id) === String(form.language_pair_id),
        }));

        // Sort: matching first
        marked.sort((a, b) => (b.isMatching ? 1 : 0) - (a.isMatching ? 1 : 0));
        setPrices(marked);
      } catch (err) {
        console.error("Failed to load prices", err);
      }
    };

    fetchPrices();
  }, [form.service_id, form.language_pair_id, projectMeta.client_id]);

  /* ================= Price row click ================= */

  const handlePriceSelect = (row) => {
    setSelectedPriceId(row.id);
    setForm((prev) => ({
      ...prev,
      service_id: row.service_id ? String(row.service_id) : prev.service_id,
      language_pair_id: row.language_pair_id ? String(row.language_pair_id) : prev.language_pair_id,
      unit_id: row.unit_id ? String(row.unit_id) : prev.unit_id,
      price_per_unit: row.price_per_unit ? String(row.price_per_unit) : prev.price_per_unit,
      currency_id: row.currency_id ? String(row.currency_id) : prev.currency_id,
    }));
  };

  /* ================= Validation ================= */

  const validate = () => {
    const e = {};
    if (!form.service_id) e.service_id = "Service is required.";
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
    po_number: form.po_number || null,
    service_id: Number(form.service_id),
    language_pair_id: form.language_pair_id ? Number(form.language_pair_id) : null,
    unit_amount: Number(form.unit_amount),
    unit_id: Number(form.unit_id),
    price_per_unit: Number(form.price_per_unit),
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
        `/project-finances/unit-based-receivables/${receivableId}`,
        payload
      );

      setSuccess(res.data.message || "Receivable updated successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update receivable");
    }
  };

  return {
    projectId,
    form,
    errors,
    serverError,
    success,
    services,
    languagePairs,
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

export default useEditUnitBasedReceivable;