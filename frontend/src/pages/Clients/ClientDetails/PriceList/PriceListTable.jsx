import { FaEdit, FaTrash } from "react-icons/fa"; // Add this import at the top

const PriceListTable = ({ data, onEdit, onDelete }) => {
  if (!data.length)
    return <div className="text-gray-500 text-center mt-4">No price list found.</div>;

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Service</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Language Pair</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Specialization</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Currency</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price/Unit</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Service - Direct access to admin service */}
              <td className="px-4 py-2">
                {item.service?.name || "—"}
              </td>

              {/* Language Pair - Direct access with source/target languages */}
              <td className="px-4 py-2">
                {item.languagePair?.sourceLanguage && item.languagePair?.targetLanguage
                  ? `${item.languagePair.sourceLanguage.code} → ${item.languagePair.targetLanguage.code}`
                  : "—"}
              </td>

              {/* Specialization - Direct access to admin specialization */}
              <td className="px-4 py-2">
                {item.specialization?.name || "—"}
              </td>

              {/* Currency - Nested currency object */}
              <td className="px-4 py-2">
                {item.currency?.currency?.code || "—"}
              </td>

              {/* Unit */}
              <td className="px-4 py-2">{item.unit || "—"}</td>

              {/* Price per Unit */}
              <td className="px-4 py-2">{item.price_per_unit || "—"}</td>

              {/* Actions */}
              <td className="px-4 py-2">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceListTable;
