const VendorLanguagePairsTable = ({ languagePairs = [], worksWithAll = false }) => {
  if (!Array.isArray(languagePairs) || languagePairs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500 italic">
          {worksWithAll
            ? "No language pairs configured by admin yet."
            : "No language pairs selected. Click 'Update Selection' to choose pairs."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50 text-gray-700 uppercase text-sm border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Source Language</th>
            <th className="px-6 py-3 text-left font-semibold">Target Language</th>
            <th className="px-6 py-3 text-left font-semibold">Number of Prices</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {languagePairs.map((pair, index) => (
            <tr
              key={pair.id || index}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-4 text-gray-800">
                {pair.sourceLanguage?.name || "—"}
              </td>
              <td className="px-6 py-4 text-gray-800">
                {pair.targetLanguage?.name || "—"}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {pair.price_count || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorLanguagePairsTable;
