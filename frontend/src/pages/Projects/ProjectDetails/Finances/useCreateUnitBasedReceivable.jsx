import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";

const useCreateUnitBasedReceivable = () => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();

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
  const [allPrices, setAllPrices] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

  const [projectMeta, setProjectMeta] = useState({
    client_id: null,
    client_name: "",
    specialization_name: "",
  });

  const [loading, setLoading] = useState(true);

  /* ================= Fetch initial data ================= */

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setServerError("");

        // First get project details to extract client_id
        const projectRes = await api.get(`/projects/${projectId}`);
        const projectData = projectRes.data.data;
        const clientId = projectData.client_id;

        console.log("Project Data:", projectData);

        // Extract client name with fallback logic
        const clientName =
          projectData.client?.company_name ||
          `${projectData.client?.primary_user?.first_name || ""} ${
            projectData.client?.primary_user?.last_name || ""
          }`.trim() ||
          "—";

        // Extract specialization name
        const specializationName = projectData.specialization?.name || "—";

        setProjectMeta({
          client_id: clientId,
          client_name: clientName,
          specialization_name: specializationName,
        });

        // Fetch dropdowns and prices in parallel
        const dropdownPromises = [
          api.get(`/client-price-list/client/${clientId}/services`).catch(err => {
            console.error("Services API error:", err);
            return { data: { data: [] } };
          }),
          api.get(`/client-price-list/client/${clientId}/language-pairs`).catch(err => {
            console.error("Language pairs API error:", err);
            return { data: { data: [] } };
          }),
          api.get(`/client-price-list/client/${clientId}/currencies`).catch(err => {
            console.error("Currencies API error:", err);
            return { data: { data: [] } };
          }),
          api.get(`/client/${clientId}/input-files`).catch(err => {
            console.error("Files API error:", err);
            return { data: { data: [] } };
          }),
          api.get(`/client-price-list/client/${clientId}/price-list`).catch(err => {
            console.error("Prices API error:", err);
            return { data: { data: { priceList: [] } } };
          }),
          api.get(`/admin-units`).catch(err => {
            console.error("Units API error:", err);
            return { data: { data: [] } };
          }),
        ];

        const [s, l, c, f, p, u] = await Promise.all(dropdownPromises);

        console.log("Services Response:", s.data);
        console.log("Language Pairs Response:", l.data);
        console.log("Currencies Response:", c.data);
        console.log("Files Response:", f.data);
        console.log("Prices Response:", p.data);
        console.log("Units Response:", u.data);

        const servicesData = Array.isArray(s.data.data) ? s.data.data : [];
        const languagePairsData = Array.isArray(l.data.data) ? l.data.data : [];
        const currenciesData = Array.isArray(c.data.data) ? c.data.data : [];
        const filesData = Array.isArray(f.data.data) ? f.data.data : [];
        const unitsData = Array.isArray(u.data.data) ? u.data.data : [];
        const pricesData = Array.isArray(p.data.data?.priceList) 
          ? p.data.data.priceList 
          : [];

        setServices(servicesData);
        setLanguagePairs(languagePairsData);
        setCurrencies(currenciesData);
        setFiles(filesData);
        setUnits(unitsData);
        setAllPrices(pricesData);

        console.log("Services State:", servicesData);
        console.log("Language Pairs State:", languagePairsData);
        console.log("Currencies State:", currenciesData);
        console.log("Files State:", filesData);
        console.log("Units State:", unitsData);
        console.log("Prices State:", pricesData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dropdown data", err);
        console.error("Error details:", err.response?.data);
        setServerError(
          err.response?.data?.message || "Failed to load form data. Please try again."
        );
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [projectId]);

  /* ================= Auto-calculate subtotal ================= */

  useEffect(() => {
    const qty = Number(form.unit_amount);
    const price = Number(form.price_per_unit);
    if (qty && price) {
      setForm((p) => ({
        ...p,
        subtotal: (qty * price).toFixed(2),
      }));
    } else {
      setForm((p) => ({
        ...p,
        subtotal: "",
      }));
    }
  }, [form.unit_amount, form.price_per_unit]);

  /* ================= Helper to get unit name by ID ================= */
  
  const getUnitNameById = (unitId) => {
    const unit = units.find(u => u.id === Number(unitId));
    return unit?.name || "";
  };

  /* ================= Sort prices: matching first (green), then others (white) ================= */

  const sortedPrices = useMemo(() => {
    // If no criteria selected, show all prices in white (no highlighting)
    const hasAnyCriteria = form.service_id || form.language_pair_id || 
                           form.unit_id || form.currency_id;

    if (!hasAnyCriteria) {
      return allPrices.map(price => ({ ...price, isMatching: false }));
    }

    // Separate matching and non-matching prices
    const matching = [];
    const nonMatching = [];

    allPrices.forEach((price) => {
      let isMatch = true;

      // Check service (must match if form has value)
      if (form.service_id && price.service_id !== Number(form.service_id)) {
        isMatch = false;
      }

      // Check language pair (must match if form has value)
      if (form.language_pair_id && price.language_pair_id !== Number(form.language_pair_id)) {
        isMatch = false;
      }

      // Check specialization (must match if project has specialization)
      if (projectMeta.specialization_name && 
          price.specialization?.name !== projectMeta.specialization_name) {
        isMatch = false;
      }

      // Check unit (must match if form has value)
      if (form.unit_id && price.unit !== getUnitNameById(form.unit_id)) {
        isMatch = false;
      }

      // Check currency (must match if form has value)
      if (form.currency_id && price.currency_id !== Number(form.currency_id)) {
        isMatch = false;
      }

      if (isMatch) {
        matching.push({ ...price, isMatching: true });
      } else {
        nonMatching.push({ ...price, isMatching: false });
      }
    });

    // Return matching prices first (green), then non-matching (white)
    return [...matching, ...nonMatching];
  }, [
    allPrices, 
    form.service_id, 
    form.language_pair_id, 
    form.unit_id, 
    form.currency_id, 
    projectMeta.specialization_name, 
    units
  ]);

  /* ================= Handlers ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setServerError("");
    setSuccess("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value?.toString().trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "This field is required.",
      }));
    }
  };

  const handlePriceSelect = (row) => {
    setSelectedPriceId(row.id);
    
    // Find the matching service ID
    const matchingService = services.find(s => s.id === row.service_id);
    const serviceId = matchingService?.id || "";

    // Find the matching language pair ID
    const matchingLanguagePair = languagePairs.find(lp => lp.id === row.language_pair_id);
    const languagePairId = matchingLanguagePair?.id || "";

    // Find the matching unit ID
    const matchingUnit = units.find(u => u.name === row.unit);
    const unitId = matchingUnit?.id || "";

    // Find the matching currency ID
    const matchingCurrency = currencies.find(c => c.id === row.currency_id);
    const currencyId = matchingCurrency?.id || "";

    console.log("Selected row:", row);
    console.log("Service ID:", serviceId);
    console.log("Language Pair ID:", languagePairId);
    console.log("Unit ID:", unitId);
    console.log("Currency ID:", currencyId);

    // Fill the form with the selected price data
    setForm((prev) => ({
      ...prev,
      service_id: serviceId,
      language_pair_id: languagePairId,
      unit_id: unitId,
      price_per_unit: row.price_per_unit || "",
      currency_id: currencyId,
      internal_note: row.note || prev.internal_note,
    }));
  };

  /* ================= Validation ================= */

  const validate = () => {
    const e = {};
    if (!form.service_id) e.service_id = "Service is required";
    if (!form.unit_amount) e.unit_amount = "Unit amount is required";
    if (!form.unit_id) e.unit_id = "Unit is required";
    if (!form.price_per_unit) e.price_per_unit = "Price per unit is required";
    if (!form.currency_id) e.currency_id = "Currency is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= Submit ================= */

  const submit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        project_id: Number(projectId),
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
      };

      console.log("Submitting payload:", payload);

      const res = await api.post("/project-finances/unit-based-receivables", payload);
      setSuccess(res.data.message || "Receivable created successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Submit error:", err);
      setServerError(
        err.response?.data?.message || "Failed to create receivable"
      );
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
    prices: sortedPrices,
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

export default useCreateUnitBasedReceivable;