import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import VendorLanguagePairsTable from "./VendorLanguagePairsTable";
import EditLanguagePairPage from "./EditLanguagePairsPage";

const VendorLanguagePairsPage = ({ vendorId }) => {
  const [worksWithAll, setWorksWithAll] = useState(false);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditPage, setShowEditPage] = useState(false);

  const fetchVendorLanguagePairs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/vendor-language-pairs/${vendorId}/language-pairs`,
        { withCredentials: true }
      );

      const data = res.data?.data;
      setWorksWithAll(data?.vendor?.works_with_all_language_pairs || false);
      setLanguagePairs(data?.languagePairs || []);
    } catch (err) {
      console.error("Error fetching vendor language pairs:", err);
      setError("Failed to fetch vendor language pairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorLanguagePairs();
  }, [vendorId]);

  const handleToggle = async () => {
    try {
      const newValue = !worksWithAll;

      // If disabling (newValue = false), initialize all language pairs
      if (!newValue) {
        await api.post("/vendor-language-pairs/initialize", {
          vendor_id: parseInt(vendorId),
        });
      }

      await api.put(
        `/vendor-settings/${vendorId}`,
        {
          works_with_all_language_pairs: newValue,
        },
        { withCredentials: true }
      );

      await fetchVendorLanguagePairs();
      setError("");
    } catch (err) {
      console.error("Error updating vendor settings:", err);
      setError(err.response?.data?.message || "Failed to update vendor settings");
    }
  };

  const handleUpdateComplete = () => {
    setShowEditPage(false);
    fetchVendorLanguagePairs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">Loading...</p>
      </div>
    );
  }

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

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-800 font-medium">
              Works with all language pairs:
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
                worksWithAll ? "text-blue-700" : "text-gray-500"
              }`}
            >
              {worksWithAll ? "Enabled" : "Disabled"}
            </span>
          </div>
          {worksWithAll && (
            <p className="text-gray-500 text-sm italic">
              This vendor inherits all admin language pairs automatically.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Language Pairs
        </h3>
        {!worksWithAll && (
          <button
            onClick={() => setShowEditPage(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition active:scale-95"
          >
            Update Selection
          </button>
        )}
      </div>

      <VendorLanguagePairsTable
        languagePairs={languagePairs}
        worksWithAll={worksWithAll}
      />

      {showEditPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowEditPage(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditPage(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none px-2"
            >
              ×
            </button>

            <EditLanguagePairPage
              vendorId={vendorId}
              onUpdateComplete={handleUpdateComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorLanguagePairsPage;
