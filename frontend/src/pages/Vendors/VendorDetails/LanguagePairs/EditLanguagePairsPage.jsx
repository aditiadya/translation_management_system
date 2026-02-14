import React, { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const EditLanguagePairsPage = ({ vendorId, onUpdateComplete }) => {
  const [languagePairs, setLanguagePairs] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState(new Set());
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
          `/vendor-language-pairs/${vendorId}/admin-pairs`,
          { withCredentials: true }
        );

        const pairs = res?.data || [];
        setLanguagePairs(pairs);

        const selected = new Set(
          pairs.filter((p) => p.is_selected).map((p) => p.id)
        );
        setSelectedPairs(selected);
        setInitialSelection(selected);
        setError("");
      } catch (error) {
        console.error("Error fetching language pairs:", error);
        setError("Failed to load language pairs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const handleCheckboxChange = (pairId) => {
    setSelectedPairs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pairId)) {
        newSet.delete(pairId);
      } else {
        newSet.add(pairId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const currentSelection = Array.from(selectedPairs);
      const previousSelection = Array.from(initialSelection);

      const toAdd = currentSelection.filter((id) => !previousSelection.includes(id));
      const toRemove = previousSelection.filter((id) => !currentSelection.includes(id));

      // Check if any of the pairs to remove have prices
      if (toRemove.length > 0) {
        const pairsToRemove = languagePairs.filter((p) => toRemove.includes(p.id));
        const totalPrices = pairsToRemove.reduce((sum, p) => sum + (p.price_count || 0), 0);

        if (totalPrices > 0) {
          const confirmed = window.confirm(
            `This will delete ${totalPrices} price(s) from ${toRemove.length} language pair(s). Continue?`
          );

          if (!confirmed) {
            setSaving(false);
            return;
          }
        }
      }

      if (toAdd.length > 0) {
        await api.post(
          "/vendor-language-pairs/bulk-create",
          {
            vendor_id: vendorId,
            language_pair_ids: toAdd,
          },
          { withCredentials: true }
        );
      }

      if (toRemove.length > 0) {
        await api.post(
          "/vendor-language-pairs/bulk-delete",
          {
            vendor_id: vendorId,
            language_pair_ids: toRemove,
          },
          { withCredentials: true }
        );
      }

      setSuccessMessage("Language pairs updated successfully!");
      setTimeout(() => {
        if (typeof onUpdateComplete === "function") {
          onUpdateComplete();
        }
      }, 1500);
    } catch (error) {
      console.error("Error saving language pairs:", error);
      setError("Failed to update language pairs. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    setSelectedPairs(new Set(languagePairs.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPairs(new Set());
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
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Select Language Pairs
      </h2>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-900 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          <span className="font-semibold">{selectedPairs.size}</span> of{" "}
          <span className="font-semibold">{languagePairs.length}</span> selected
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

      <div className="overflow-hidden rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Prices
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {languagePairs.map((pair) => {
              const isSelected = selectedPairs.has(pair.id);
              return (
                <tr
                  key={pair.id}
                  className={`hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleCheckboxChange(pair.id)}
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(pair.id)}
                      disabled={saving}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {pair.sourceLanguage?.name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {pair.targetLanguage?.name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {pair.price_count || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

export default EditLanguagePairsPage;
