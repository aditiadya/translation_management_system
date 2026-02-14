import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const PriceListForm = ({ vendorId, editingItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    vendor_id: vendorId,
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
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchDropdowns();
    if (editingItem) {
      setFormData({
        vendor_id: vendorId,
        service_id: editingItem.service_id,
        language_pair_id: editingItem.language_pair_id,
        specialization_id: editingItem.specialization_id,
        currency_id: editingItem.currency_id,
        unit: editingItem.unit,
        price_per_unit: editingItem.price_per_unit,
        note: editingItem.note || "",
      });
    }
  }, [editingItem, vendorId]);

  const fetchDropdowns = async () => {
    try {
      const [svc, lp, spec, cur, unt] = await Promise.all([
        api.get(`/vendor-services/${vendorId}/services`),
        api.get(`/vendor-language-pairs/${vendorId}/language-pairs`),
        api.get(`/vendor-specializations/${vendorId}/specializations`),
        api.get(`/admin-currencies`),
        api.get(`/admin-units`),
      ]);

      // Debug logs
      console.log("Services Response:", svc.data);
      console.log("Language Pairs Response:", lp.data);
      console.log("Specializations Response:", spec.data);
      console.log("Currencies Response:", cur.data);
      console.log("Units Response:", unt.data);

      // Set services
      const servicesData = svc.data.data?.services || [];
      setServices(Array.isArray(servicesData) ? servicesData : []);

      // Set language pairs - FIX HERE
      const languagePairsData = lp.data.data?.languagePairs || [];
      console.log("Language Pairs Data:", languagePairsData);
      setLanguagePairs(Array.isArray(languagePairsData) ? languagePairsData : []);

      // Set specializations
      const specializationsData = spec.data.data?.specializations || [];
      setSpecializations(Array.isArray(specializationsData) ? specializationsData : []);

      // Set currencies
      const currenciesData = cur.data.data || [];
      setCurrencies(Array.isArray(currenciesData) ? currenciesData : []);

      // Set units
      const unitsData = unt.data.data || [];
      setUnits(Array.isArray(unitsData) ? unitsData : []);
    } catch (err) {
      console.error("Failed to load dropdowns", err);
      console.error("Error details:", err.response?.data);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Dropdown */}
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
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Language Pair Dropdown - FIXED */}
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
            {languagePairs && languagePairs.length > 0 ? (
              languagePairs.map((lp) => {
                // Debug each item
                console.log("Rendering language pair:", lp);
                return (
                  <option key={lp.id} value={lp.id}>
                    {lp.sourceLanguage?.code || "?"} → {lp.targetLanguage?.code || "?"}
                  </option>
                );
              })
            ) : (
              <option disabled>No language pairs available</option>
            )}
          </select>
        </div>

        {/* Specialization Dropdown */}
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
                {sp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Dropdown */}
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

        {/* Unit Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">Select unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price per Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Unit</label>
          <input
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Note</label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded px-3 py-2"
          placeholder="Optional notes..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {editingItem ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default PriceListForm;
