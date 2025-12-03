import { useState } from "react";
import api from "../../utils/axiosInstance";

const ManagersCard = ({
  pool,
  allManagers,
  isEditing,
  setIsEditing,
  formState,
  setFormState,
  setPool,
}) => {
  const [loading, setLoading] = useState(false);

  const handleMultiSelect = (field, id) => {
    setFormState((prev) => {
      const values = prev[field];
      return {
        ...prev,
        [field]: values.includes(id)
          ? values.filter((v) => v !== id)
          : [...values, id],
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        manager_ids: formState.manager_ids,
      };

      const res = await api.put(`/client-pools/${pool.id}`, payload);
      if (res.data.success) {
        const updatedManagers = res.data.data.managers;

        setFormState((prev) => ({
          ...prev,
          manager_ids: updatedManagers.map((m) => m.id),
        }));

        setPool((prev) => ({
          ...prev,
          managers: updatedManagers,
        }));

        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update managers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Managers</h3>
          <span className="text-sm text-gray-500">
            ({pool.managers?.length || 0})
          </span>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded shadow"
          >
            Update Managers
          </button>
        ) : (
          <div className="text-sm text-gray-500">Select managers below</div>
        )}
      </div>

      <div className="border rounded-lg overflow-y-auto max-h-48">
        {isEditing ? (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
              <tr>
                <th className="p-2 w-12"></th>
                <th className="p-2">Name</th>
                <th className="p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {allManagers.map((m) => {
                const isChecked = formState.manager_ids.includes(m.id);
                const contact = m.email || m.phone || m.teams_id || "—";

                return (
                  <tr
                    key={m.id}
                    onClick={() => handleMultiSelect("manager_ids", m.id)}
                    className={`cursor-pointer border-b last:border-0 ${
                      isChecked
                        ? "bg-indigo-50 hover:bg-indigo-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiSelect("manager_ids", m.id)}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-2 font-medium text-gray-800">
                      {`${m.first_name || ""} ${m.last_name || ""}`.trim() ||
                        `Manager #${m.id}`}
                    </td>
                    <td className="p-2 text-gray-600">{contact}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <ul className="divide-y">
            {pool.managers && pool.managers.length > 0 ? (
              pool.managers.map((manager) => (
                <li
                  key={manager.id}
                  className="p-3 flex items-center gap-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="text-md text-gray-700">
                      {manager.first_name} {manager.last_name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {manager.email || manager.phone || "—"}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No managers assigned</li>
            )}
          </ul>
        )}
      </div>

      {isEditing && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
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
  );
};

export default ManagersCard;