import React, { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const EditServicePage = ({ vendorId, onUpdateComplete }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [initialSelection, setInitialSelection] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: res } = await api.get(
          `/vendor-services/${vendorId}/admin-services`,
          { withCredentials: true }
        );

        const servicesData = res?.data || [];
        console.log("Services with selection:", servicesData);
        
        setServices(servicesData);

        const selected = new Set(
          servicesData.filter((s) => s.is_selected).map((s) => s.id)
        );
        setSelectedServices(selected);
        setInitialSelection(selected);
        setError("");
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const handleCheckboxChange = (serviceId) => {
    setSelectedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const currentSelection = Array.from(selectedServices);
      const previousSelection = Array.from(initialSelection);

      const toAdd = currentSelection.filter((id) => !previousSelection.includes(id));
      const toRemove = previousSelection.filter((id) => !currentSelection.includes(id));

      console.log("Services to add:", toAdd);
      console.log("Services to remove:", toRemove);

      // Check if any of the services to remove have prices
      if (toRemove.length > 0) {
        const servicesToRemove = services.filter((s) => toRemove.includes(s.id));
        const totalPrices = servicesToRemove.reduce((sum, s) => sum + (s.price_count || 0), 0);

        if (totalPrices > 0) {
          const confirmed = window.confirm(
            `This will delete ${totalPrices} price(s) from ${toRemove.length} service(s). Continue?`
          );

          if (!confirmed) {
            setSaving(false);
            return;
          }
        }
      }

      // Add new services
      for (const serviceId of toAdd) {
        await api.post(
          "/vendor-services",
          {
            vendor_id: vendorId,
            service_id: serviceId,
          },
          { withCredentials: true }
        );
      }

      // Remove deselected services (CASCADE deletes price list entries)
      for (const serviceId of toRemove) {
        const vendorServicesRes = await api.get(`/vendor-services`, {
          withCredentials: true,
        });
        
        const vendorService = vendorServicesRes.data.data.find(
          (vs) => vs.vendor_id === parseInt(vendorId) && vs.service_id === serviceId
        );

        if (vendorService) {
          await api.delete(`/vendor-services/${vendorService.id}`, {
            withCredentials: true,
          });
        }
      }

      setSuccessMessage("Services updated successfully!");
      setTimeout(() => {
        if (typeof onUpdateComplete === "function") {
          onUpdateComplete();
        }
      }, 1500);
    } catch (error) {
      console.error("Error saving services:", error);
      setError("Failed to update services. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedServices(new Set(services.map((s) => s.id)));
  };

  const handleDeselectAll = () => {
    setSelectedServices(new Set());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading services...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Manage Vendor Services
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-900 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          <span className="font-semibold">{selectedServices.size}</span> of{" "}
          <span className="font-semibold">{services.length}</span> selected
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            disabled={saving}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Select All
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={saving}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Select
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Prices
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {services.map((service) => {
              const isSelected = selectedServices.has(service.id);
              return (
                <tr
                  key={service.id}
                  className={`hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleCheckboxChange(service.id)}
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(service.id)}
                      disabled={saving}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {service.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {service.price_count || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-8 py-3 rounded-xl text-white text-lg font-medium shadow-md transition-all duration-200 ${
            saving
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditServicePage;
