import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import VendorServicesTable from "./VendorServicesTable";
import EditServicePage from "./EditServicesPage";

const VendorServicesPage = ({ vendorId }) => {
  const [worksWithAll, setWorksWithAll] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditPage, setShowEditPage] = useState(false);

  const fetchVendorSettings = async () => {
    try {
      const res = await api.get(`/vendor-settings/${vendorId}`, {
        withCredentials: true,
      });
      setWorksWithAll(res.data.data?.works_with_all_services || false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vendor settings");
    }
  };

  const fetchVendorServices = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/vendor-services/${vendorId}/services`, {
        withCredentials: true,
      });
      const data = res.data?.data;

      if (Array.isArray(data)) {
        setServices(data);
      } else if (Array.isArray(data?.services)) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching vendor services:", err);
      setError("Failed to fetch vendor services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorSettings();
    fetchVendorServices();
  }, [vendorId]);

  const handleToggle = async () => {
  try {
    const newValue = !worksWithAll;
    
      // If disabling (newValue = false), initialize all services
        if (!newValue) {
          await api.post("/vendor-services/initialize", {
          vendor_id: parseInt(vendorId), // PARSE TO INTEGER
        });
      }
    
      setWorksWithAll(newValue);
      await api.put(`/vendor-settings/${vendorId}`, {
        works_with_all_services: newValue,
      });
    
      fetchVendorServices();
      setError("");
    } catch (err) {
      console.error("Toggle error:", err);
      console.error("Error response:", err.response?.data); // For debugging
      setError(err.response?.data?.message || "Failed to update vendor settings");
    }
};


  const handleUpdateComplete = () => {
    setShowEditPage(false);
    fetchVendorServices();
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-900 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium">
            Works with all services:
          </span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
              worksWithAll ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                worksWithAll ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`font-semibold ${
              worksWithAll ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {worksWithAll ? "Enabled" : "Disabled"}
          </span>
        </div>
        {worksWithAll && (
          <p className="text-gray-500 text-sm italic">
            This vendor works with all services.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Services</h3>
        {!worksWithAll && (
          <button
            onClick={() => setShowEditPage(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Update
          </button>
        )}
      </div>

      <VendorServicesTable
        services={services}
        vendorId={vendorId}
        allowUpdate={!worksWithAll}
      />

      {showEditPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowEditPage(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditPage(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none px-2"
            >
              ×
            </button>
            
            <EditServicePage 
              vendorId={vendorId} 
              onUpdateComplete={handleUpdateComplete} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorServicesPage;
