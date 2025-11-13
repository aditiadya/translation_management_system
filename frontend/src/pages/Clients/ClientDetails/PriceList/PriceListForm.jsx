import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const PriceListForm = ({ clientId, editingItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    client_id: clientId,
    service_id: "",
    language_pair_id: "",
    specialization_id: "",
    currency_id: "",
    unit: "",
    price_per_unit: "",
    note: "",
  });

  const [services, setServices] = useState([]);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchDropdowns();
    if (editingItem) {
      setFormData({
        client_id: clientId,
        service_id: editingItem.service_id,
        language_pair_id: editingItem.language_pair_id,
        specialization_id: editingItem.specialization_id,
        currency_id: editingItem.currency_id,
        unit: editingItem.unit,
        price_per_unit: editingItem.price_per_unit,
        note: editingItem.note || "",
      });
    }
  }, [editingItem, clientId]);

  const fetchDropdowns = async () => {
  try {
    const [svc, lp, spec, cur] = await Promise.all([
      api.get(`/admin-services/${clientId}/services`),
      api.get(`/admin-language-pairs/${clientId}/language-pairs`),
      api.get(`/admin-specializations/${clientId}/specializations`),
      api.get(`/admin-currencies`),
    ]);

    setServices(Array.isArray(svc.data.data?.services) ? svc.data.data.services : []);
    setLanguagePairs(Array.isArray(lp.data.data?.languagePairs) ? lp.data.data.languagePairs : []);
    setSpecializations(Array.isArray(spec.data.data?.specializations) ? spec.data.data.specializations : []);
    setCurrencies(Array.isArray(cur.data.data) ? cur.data.data : []);
  } catch (err) {
    console.error("Failed to load dropdowns", err);
  }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {editingItem ? "Edit Price" : "Add New Price"}
      </h2>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Service</label>
          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.service?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Language Pair</label>
          <select
            name="language_pair_id"
            value={formData.language_pair_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select language pair</option>
            {languagePairs.map((lp) => (
              <option key={lp.id} value={lp.id}>
                {lp.language_pair?.source_language_id} → {lp.language_pair?.target_language_id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <select
            name="specialization_id"
            value={formData.specialization_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select specialization</option>
            {specializations.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.specialization?.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            name="currency_id"
            value={formData.currency_id}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select currency</option>
            {currencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.currency?.code} ({c.currency?.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Unit</label>
          <input
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingItem ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default PriceListForm;
