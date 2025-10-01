const ServiceList = ({ services, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow rounded-lg bg-white mt-6">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-black uppercase text-sm">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No services added yet.
              </td>
            </tr>
          ) : (
            services.map((service, index) => (
              <tr
                key={service.id}
                className={
                  index % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "hover:bg-gray-100"
                }
              >
                <td className="py-4 px-6">{service.name}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 inline-block text-sm rounded-full ${
                      service.active_flag
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {service.active_flag ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-6 space-x-2">
                  <button
                    onClick={() => onEdit(service)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(service.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;