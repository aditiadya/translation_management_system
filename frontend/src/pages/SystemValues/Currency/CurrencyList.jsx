import { Pencil, Trash2 } from "lucide-react";

const CurrencyList = ({ userCurrencies, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow rounded-lg bg-white mt-6">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-black uppercase text-sm">
            <th className="py-3 px-6 text-left">Currency</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userCurrencies.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No currencies added yet.
              </td>
            </tr>
          ) : (
            userCurrencies.map((item, index) => (
              <tr
                key={item.id}
                className={
                  index % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "hover:bg-gray-100"
                }
              >
                <td className="py-3 px-4 text-sm text-gray-500">
                  {item.currency?.code} - {item.currency?.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <span
                    className={`px-3 py-1 inline-block text-sm rounded-full ${
                      item.active_flag
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.active_flag ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-5 text-sm flex items-center">
                  <button onClick={() => onEdit(item)}>
                    <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
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

export default CurrencyList;
