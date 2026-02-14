const VendorServicesTable = ({ services = [] }) => {
  if (!Array.isArray(services) || services.length === 0) {
    return (
      <p className="text-center text-gray-500 italic mt-4">
        No services found for this vendor.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-1/3 border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th className="px-6 py-3 text-left">Service Name</th>
            <th className="px-6 py-3 text-left">Number of Prices</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              className="border-t hover:bg-gray-50 transition duration-200"
            >
              <td className="px-6 py-3">{service.name}</td>
              <td className="px-6 py-3">{service.price_count || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorServicesTable;
