import { useState } from "react";
import api from "../../utils/axiosInstance";
import ConfirmModal from "../../components/Modals/ConfirmModal";

const ClientsCard = ({
  pool,
  allClients,
  isEditing,
  setIsEditing,
  formState,
  handleMultiSelect,
  setPool,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    try {
      const res = await api.put(`/client-pools/${pool.id}`, {
        client_ids: formState.client_ids,
      });

      if (res.data.success) {
        setPool(res.data.data);
        setIsEditing(false);
        setShowConfirm(false);
      }
    } catch (err) {
      console.error("Failed to update clients:", err);
      alert("Failed to update clients. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-gray-800">Clients</h3>
          <span className="text-sm text-gray-500">
            ({pool.clients?.length || 0})
          </span>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded shadow"
          >
            Update Clients
          </button>
        ) : (
          <div className="text-sm text-gray-500">Select clients below</div>
        )}
      </div>

      <div className="border rounded-lg overflow-y-auto max-h-64">
        {isEditing ? (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700">
              <tr>
                <th className="p-2 w-12"></th>
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Country</th>
              </tr>
            </thead>
            <tbody>
              {allClients.map((c) => {
                const isChecked = formState.client_ids.includes(c.id);
                return (
                  <tr
                    key={c.id}
                    onClick={() => handleMultiSelect("client_ids", c.id)}
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
                        onChange={() => handleMultiSelect("client_ids", c.id)}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="p-2 font-medium text-gray-800">
                      {c.company_name
                        ? c.company_name
                        : `${c.primary_users?.first_name || ""} ${
                            c.primary_users?.last_name || ""
                          }`.trim()}
                    </td>
                    <td className="p-2 text-gray-600">{c.type || "—"}</td>
                    <td className="p-2 text-gray-600">{c.status || "—"}</td>
                    <td className="p-2 text-gray-600">{c.country || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <ul className="divide-y">
            {pool.clients && pool.clients.length > 0 ? (
              pool.clients.map((client) => (
                <li
                  key={client.id}
                  className="p-3 flex items-center gap-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">
                      {client.company_name
                        ? client.company_name
                        : `${client.primary_users?.first_name || ""} ${
                            client.primary_users?.last_name || ""
                          }`.trim()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {client.type || "—"} • {client.status || "—"} •{" "}
                      {client.country || "—"}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-500">No clients in this pool</li>
            )}
          </ul>
        )}
      </div>

      {isEditing && (
        <div className="flex gap-3 mt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            onClick={() => setShowConfirm(true)}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
          >
            Cancel
          </button>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          title="Confirm Update"
          message="Are you sure you want to update and save the selected clients?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleSave}
          confirmText="Save"
          confirmColor="bg-green-600"
          confirmHoverColor="hover:bg-green-700"
        />
      )}
    </div>
  );
};

export default ClientsCard;