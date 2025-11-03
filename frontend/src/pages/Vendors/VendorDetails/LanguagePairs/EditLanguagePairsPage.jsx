import React, { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const EditLanguagePairsPage = ({ vendorId, onUpdateComplete }) => {
  const [languagePairs, setLanguagePairs] = useState([]);
  const [vendorLanguagePairs, setVendorLanguagePairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all admin language pairs
        const { data: adminPairsRes } = await api.get("/admin-language-pairs", {
          withCredentials: true,
        });

        // Fetch vendor-specific language pairs
        const { data: vendorPairsRes } = await api.get(
          `/vendor-language-pairs/${vendorId}/language-pairs`,
          { withCredentials: true }
        );

        const allLanguagePairs = adminPairsRes?.data || [];

        let vendorPairsArray = [];
        const vendorData = vendorPairsRes?.data?.data;

        if (Array.isArray(vendorData)) {
          vendorPairsArray = vendorData;
        } else if (Array.isArray(vendorData?.languagePairs)) {
          vendorPairsArray = vendorData.languagePairs;
        }

        const normalizedVendorPairs = vendorPairsArray.map((vp) => ({
          id: vp.id,
          language_pair_id: Number(
            vp.language_pair_id || vp.languagePair?.id || vp.languagePairId
          ),
          source_language_name:
            vp.sourceLanguage?.name ||
            vp.languagePair?.sourceLanguage?.name ||
            "",
          target_language_name:
            vp.targetLanguage?.name ||
            vp.languagePair?.targetLanguage?.name ||
            "",
        }));

        console.log("Normalized Vendor Language Pairs:", normalizedVendorPairs);
        console.log("Admin Language Pairs:", allLanguagePairs);

        setLanguagePairs(allLanguagePairs);
        setVendorLanguagePairs(normalizedVendorPairs);
      } catch (error) {
        console.error("Error fetching language pairs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const isPairSelected = (pairId) =>
    vendorLanguagePairs.some(
      (vp) => Number(vp.language_pair_id) === Number(pairId)
    );

  const handleCheckboxChange = async (pair) => {
    try {
      setUpdating(true);
      const selected = isPairSelected(pair.id);

      if (!selected) {
        // ✅ Add vendor-language-pair
        const alreadyExists = vendorLanguagePairs.some(
          (vp) => Number(vp.language_pair_id) === Number(pair.id)
        );
        if (alreadyExists) return;

        const res = await api.post(
          "/vendor-language-pairs",
          {
            vendor_id: vendorId,
            language_pair_id: pair.id,
          },
          {
            withCredentials: true,
          }
        );

        const addedPair = res.data.data;
        setVendorLanguagePairs((prev) => [
          ...prev,
          {
            id: addedPair.id,
            language_pair_id: addedPair.language_pair_id,
            source_language_name: pair.sourceLanguage?.name,
            target_language_name: pair.targetLanguage?.name,
          },
        ]);
      } else {
        // ❌ Remove vendor-language-pair
        const vendorPair = vendorLanguagePairs.find(
          (vp) => Number(vp.language_pair_id) === Number(pair.id)
        );

        if (vendorPair) {
          await api.delete(`/vendor-language-pairs/${vendorPair.id}`, {
            withCredentials: true,
          });

          setVendorLanguagePairs((prev) =>
            prev.filter((vp) => Number(vp.language_pair_id) !== Number(pair.id))
          );
        }
      }
    } catch (error) {
      console.error("Error updating vendor language pair:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading language pairs...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white rounded-2xl p-3 transition-all">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Manage Vendor Language Pairs
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Select
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Source Language
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Target Language
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {languagePairs.map((pair) => {
              const selected = isPairSelected(pair.id);
              return (
                <tr
                  key={pair.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={updating}
                      onChange={() => handleCheckboxChange(pair)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {pair.sourceLanguage?.name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {pair.targetLanguage?.name || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-5">
        <button
          onClick={() => {
            alert("Language pairs updated successfully!");
            if (typeof onUpdateComplete === "function") onUpdateComplete();
          }}
          disabled={updating}
          className={`px-8 py-3 rounded-xl text-white text-lg font-medium shadow-md transition-all duration-200 ${
            updating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {updating ? "Updating..." : "Update Language Pairs"}
        </button>
      </div>
    </div>
  );
};

export default EditLanguagePairsPage;
