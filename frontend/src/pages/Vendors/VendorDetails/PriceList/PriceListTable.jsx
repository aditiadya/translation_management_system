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
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2">{item.service?.service?.name || "—"}</td>
              <td className="px-4 py-2">
                {item.languagePair?.languagePair
                  ? `${item.languagePair.languagePair.source_language_id} → ${item.languagePair.languagePair.target_language_id}`
                  : "—"}
              </td>
              <td className="px-4 py-2">{item.specialization?.specialization?.name || "—"}</td>
              <td className="px-4 py-2">
                {item.currency?.currency?.code || "—"}
              </td>
              <td className="px-4 py-2">{item.unit}</td>
              <td className="px-4 py-2">{item.price_per_unit}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceListTable;
