import dayjs from "dayjs";

const PaymentMethodList = ({ methods, onEdit, onDelete }) => {
  const renderBankInfo = (method) => {
    if (method.payment_method !== "bank_transfer") return "N/A";

    const bankDetails = method.bank_transfer_detail || method.details || {};

    const fields = [
      { label: "Bank Name", value: bankDetails.bank_name },
      { label: "Bank Address", value: bankDetails.bank_address },
      { label: "SWIFT", value: bankDetails.swift },
      { label: "Beneficiary Name", value: bankDetails.beneficiary_name },
      { label: "Beneficiary Address", value: bankDetails.beneficiary_address },
      { label: "Account Number", value: bankDetails.account_number },
      { label: "IFSC Code", value: bankDetails.ifsc_code },
      { label: "IBAN", value: bankDetails.iban },
      { label: "Sort Code", value: bankDetails.sort_code },
      { label: "Country", value: bankDetails.country },
      { label: "State / Region", value: bankDetails.state_region },
      { label: "City", value: bankDetails.city },
      { label: "Postal Code", value: bankDetails.postal_code },
    ];

    const filtered = fields.filter((f) => f.value && f.value.trim() !== "");

    return filtered.length > 0 ? (
      <div className="text-sm text-gray-700 space-y-1 max-h-48 overflow-y-auto pr-1">
        {filtered.map((f, i) => (
          <div key={i}>
            <span className="font-medium">{f.label}:</span> {f.value}
          </div>
        ))}
      </div>
    ) : (
      "N/A"
    );
  };

  const renderPaymentMethodName = (method) => {
    const type = method.payment_method;
    if (type === "bank_transfer")
      return method.bank_transfer_detail?.payment_method_name || "N/A";
    if (["paypal", "payoneer", "skrill"].includes(type))
      return (
        method[`${type}_detail`]?.email ||
        method.email_payment_detail?.email ||
        "N/A"
      );
    if (type === "other")
      return method.other_payment_detail?.payment_method_name || "N/A";
    return "N/A";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("YYYY-MM-DD HH:mm");
  };

  return (
    <div className="overflow-x-auto shadow rounded-lg bg-white mt-6">
      <table className="min-w-full leading-normal border-collapse">
        <thead>
          <tr className="bg-gray-100 text-black uppercase text-sm">
            <th className="py-3 px-4 text-left w-1/6">Payment Method Type</th>
            <th className="py-3 px-4 text-left w-1/6">Payment Method Name</th>
            <th className="py-3 px-4 text-left w-1/3">Bank Info</th>
            <th className="py-3 px-4 text-left w-1/4">Note</th>
            <th className="py-3 px-4 text-left w-1/12">Is Enabled</th>
            <th className="py-3 px-4 text-left w-1/6">Created At</th>
            <th className="py-3 px-4 text-left w-1/12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {methods.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No payment methods added yet.
              </td>
            </tr>
          ) : (
            methods.map((method, index) => (
              <tr
                key={method.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-4 px-4 capitalize">
                  {method.payment_method.replace("_", " ")}
                </td>

                <td className="py-4 px-4 font-medium text-gray-800">
                  {renderPaymentMethodName(method)}
                </td>

                <td className="py-4 px-4 align-top">
                  {renderBankInfo(method)}
                </td>

                <td className="py-4 px-4">
                  <div className="text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto pr-1">
                    {method.note || "-"}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 inline-block text-sm rounded-full ${
                      method.active_flag
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {method.active_flag ? "Yes" : "No"}
                  </span>
                </td>

                <td className="py-4 px-4 text-gray-600">
                  {formatDate(method.createdAt)}
                </td>

                <td className="py-4 px-4 space-x-2 text-nowrap">
                  <button
                    onClick={() => onEdit(method)}
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(method.id)}
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

export default PaymentMethodList;