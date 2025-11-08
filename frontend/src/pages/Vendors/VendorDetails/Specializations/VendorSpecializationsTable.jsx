const VendorSpecializationsTable = ({ specializations = [] }) => {
  if (!Array.isArray(specializations) || specializations.length === 0) {
    return (
      <p className="text-center text-gray-500 italic mt-4">
        No specializations found for this vendor.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-1/3 border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="px-6 py-3 text-left">Specialization Name</th>
            <th className="px-6 py-3 text-left">Number of Prices</th>
          </tr>
        </thead>
        <tbody>
          {specializations.map((spec) => (
            <tr
              key={spec.id}
              className="border-t hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-3">{spec.name}</td>
              <td className="px-6 py-3">{spec.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorSpecializationsTable;