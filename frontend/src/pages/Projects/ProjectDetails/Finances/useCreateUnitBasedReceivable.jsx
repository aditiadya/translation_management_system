import { useEffect, useState } from "react";
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
    unit: "",
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
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

  const [projectMeta, setProjectMeta] = useState({
    client_name: "",
    specialization_name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, l, c, f, p, pr] = await Promise.all([
          api.get(`/projects/${projectId}/services`),
          api.get(`/projects/${projectId}/language-pairs`),
          api.get(`/currencies`),
          api.get(`/projects/${projectId}/input-files`),
          api.get(`/projects/${projectId}`),
          api.get(`/clients/prices`),
        ]);

        setServices(s.data.data);
        setLanguagePairs(l.data.data);
        setCurrencies(c.data.data);
        setFiles(f.data.data);
        setPrices(pr.data.data);

        setProjectMeta({
          client_name: p.data.data.client_name,
          specialization_name: p.data.data.specialization_name,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [projectId]);

  useEffect(() => {
    const qty = Number(form.unit_amount);
    const price = Number(form.price_per_unit);
    if (qty && price) {
      setForm((p) => ({
        ...p,
        subtotal: (qty * price).toFixed(2),
      }));
    }
  }, [form.unit_amount, form.price_per_unit]);

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
    setForm((prev) => ({
      ...prev,
      service_id: row.service_id,
      language_pair_id: row.language_pair_id,
      unit: row.unit,
      price_per_unit: row.price_per_unit,
      currency_id: row.currency_id,
      internal_note: row.note || prev.internal_note,
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.service_id) e.service_id = "Required";
    if (!form.unit_amount) e.unit_amount = "Required";
    if (!form.price_per_unit) e.price_per_unit = "Required";
    if (!form.currency_id) e.currency_id = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        project_id: Number(projectId),
        ...form,
        service_id: Number(form.service_id),
        language_pair_id: Number(form.language_pair_id),
        currency_id: Number(form.currency_id),
        file_id: form.file_id ? Number(form.file_id) : null,
      };
      const res = await api.post("/unit-based-receivables", payload);
      setSuccess(res.data.message || "Receivable created");
      navigate(-1);
    } catch (err) {
      setServerError(err.response?.data?.message || "Creation failed");
    }
  };

  return {
    projectId,
    form,
    errors,
    services,
    languagePairs,
    currencies,
    files,
    prices,
    selectedPriceId,
    projectMeta,
    handleChange,
    handleBlur,
    handlePriceSelect,
    submit,
    navigate,
  };
};

export default useCreateUnitBasedReceivable;