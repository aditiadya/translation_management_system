import { useState } from "react";
import api from "../../utils/axiosInstance"; // adjust path if needed

const PoolInfoCard = ({ pool, isEditing, setIsEditing, infoForm, setInfoForm, setPool }) => {
  const [loading, setLoading] = useState(false);

  const handleSaveInfo = async () => {
    setLoading(true);
    try {
      const payload = {
        name: infoForm.name,
        description: infoForm.description,
      };

      const res = await api.put(`/client-pools/${pool.id}`, payload);

      if (res.data.success) {
        // Update parent pool state
        setPool(res.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update pool info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          {!isEditing ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {pool.name}
              </h2>
              <p className="text-gray-600">
                {pool.description || "No description provided."}
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pool Name
                </label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) =>
                    setInfoForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={infoForm.description}
                  onChange={(e) =>
                    setInfoForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded shadow"
            >
              Update Info
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSaveInfo}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolInfoCard;
