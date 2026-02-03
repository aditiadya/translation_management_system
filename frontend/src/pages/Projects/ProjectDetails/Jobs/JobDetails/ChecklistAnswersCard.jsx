const ChecklistAnswersCard = ({ checklist }) => {
  const hasChecklist =
    Array.isArray(checklist) && checklist.length > 0;

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      {/* Header */}
      <h3 className="text-base font-semibold text-gray-800">
        Checklist answers by vendor
      </h3>

      {/* Empty state */}
      {!hasChecklist && (
        <div className="text-sm text-gray-500 border rounded-md p-4 bg-gray-50">
          No checklist questions provided
        </div>
      )}

      {/* Table */}
      {hasChecklist && (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600 w-12">
                  #
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Checklist item
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 w-24">
                  Answer
                </th>
              </tr>
            </thead>

            <tbody>
              {checklist.map((item, i) => (
                <tr
                  key={item.id || i}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">
                    {i + 1}
                  </td>

                  <td className="px-4 py-3 text-gray-800">
                    {item.question || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {item.answer ? (
                      <span className="text-green-700 font-medium">
                        {item.answer}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChecklistAnswersCard;