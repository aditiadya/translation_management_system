import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import VendorLanguagePairsTable from "./VendorLanguagePairsTable";
import EditLanguagePairPage from "./EditLanguagePairsPage";

const VendorLanguagePairsPage = ({ vendorId }) => {
  const [worksWithAll, setWorksWithAll] = useState(false);
  const [languagePairs, setLanguagePairs] = useState([]);
  const [adminLanguagePairs, setAdminLanguagePairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditPage, setShowEditPage] = useState(false);

  const fetchVendorSettings = async () => {
    try {
      const res = await api.get(`/vendor-settings/${vendorId}`, { withCredentials: true });
      setWorksWithAll(res.data.data?.works_with_all_language_pairs || false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vendor settings");
    }
  };

  const fetchAdminLanguagePairs = async () => {
    try {
      const res = await api.get(`/admin-language-pairs`, { withCredentials: true });
      return res.data?.data || [];
    } catch (err) {
      console.error("Error fetching admin language pairs:", err);
      return [];
    }
  };

  const fetchVendorLanguagePairs = async () => {
    setLoading(true);
    try {
      const [vendorRes, adminPairs] = await Promise.all([
        api.get(`/vendor-language-pairs/${vendorId}/language-pairs`, { withCredentials: true }),
        fetchAdminLanguagePairs(),
      ]);

      const vendorData = vendorRes.data?.data?.languagePairs || [];

      // 🔗 Merge vendor and admin language pair info by ID
      const merged = vendorData.map((vp) => {
        const match = adminPairs.find(
          (ap) => ap.source_language_id === vp.source_language_id && ap.target_language_id === vp.target_language_id
        );
        return {
          ...vp,
          sourceLanguage: match?.sourceLanguage,
          targetLanguage: match?.targetLanguage,
        };
      });

      setLanguagePairs(merged);
    } catch (err) {
      console.error("Error fetching vendor language pairs:", err);
      setError("Failed to fetch vendor language pairs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorSettings();
    fetchVendorLanguagePairs();
  }, [vendorId]);

  const handleToggle = async () => {
    try {
      const newValue = !worksWithAll;
      setWorksWithAll(newValue);
      await api.put(`/vendor-settings/${vendorId}`, {
        works_with_all_language_pairs: newValue,
      });
      fetchVendorLanguagePairs();
    } catch (err) {
      console.error(err);
      alert("Failed to update vendor settings");
    }
  };

  const handleUpdateComplete = () => {
    setShowEditPage(false);
    fetchVendorLanguagePairs();
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Toggle Section */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex items-center justify-between">
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
              worksWithAll ? "text-gray-700" : "text-gray-500"
            }`}
          >
            {worksWithAll ? "Enabled" : "Disabled"}
          </span>
        </div>
        {worksWithAll && (
          <p className="text-gray-500 text-sm italic">
            This vendor works with all language pairs.
          </p>
        )}
      </div>

      {/* Table Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Language Pairs</h3>
        {!worksWithAll && (
          <button
            onClick={() => setShowEditPage(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Update
          </button>
        )}
      </div>

      {/* Table */}
      <VendorLanguagePairsTable
        languagePairs={languagePairs}
        vendorId={vendorId}
        allowUpdate={!worksWithAll}
      />

      {/* Edit Modal */}
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
