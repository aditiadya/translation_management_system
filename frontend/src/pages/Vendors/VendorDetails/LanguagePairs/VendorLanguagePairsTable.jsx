const VendorLanguagePairsTable = ({ languagePairs = [] }) => {
  if (!Array.isArray(languagePairs) || languagePairs.length === 0) {
    return (
      <p className="text-center text-gray-500 italic mt-4">
        No language pairs found for this vendor.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="px-6 py-3 text-left">Source Language</th>
            <th className="px-6 py-3 text-left">Target Language</th>
            <th className="px-6 py-3 text-left">Number of Prices</th>
          </tr>
        </thead>
        <tbody>
          {languagePairs.map((pair) => (
            <tr
              key={pair.id}
              className="border-t hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-3">
                {pair.sourceLanguage?.name || "—"}
              </td>
              <td className="px-6 py-3">
                {pair.targetLanguage?.name || "—"}
              </td>
              <td className="px-6 py-3">{pair.priceCount || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorLanguagePairsTable;
