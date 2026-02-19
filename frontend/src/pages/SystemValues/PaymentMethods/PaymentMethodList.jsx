import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";

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
  if (["paypal", "payoneer", "skrill"].includes(type)) {
    const detail = method[`${type}_detail`] || method.email_payment_detail;
    const email = detail?.email;
    const accountHolder = detail?.account_holder_name;
    if (!email) return "N/A";
    return (
      <div>
        <div>{email}</div>
        {accountHolder && (
          <div className="text-xs text-gray-500">{accountHolder}</div>
        )}
      </div>
    );
  }
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
            <th className="py-3 px-4 text-left w-1/3">Details</th>
            <th className="py-3 px-4 text-left w-1/4">Note</th>
            <th className="py-3 px-4 text-left w-1/12">Is Enabled</th>
            <th className="py-3 px-4 text-left w-1/6">Created At</th>
            <th className="py-3 px-4 text-left w-1/12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {methods.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500">
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
                <td className="py-3 px-4 text-sm text-gray-500 capitalize">
  <div className="flex items-center gap-2">
    <span>{method.payment_method.replace("_", " ")}</span>
    {method.is_default && (
      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-300">
        Default
      </span>
    )}
  </div>
</td>

                <td className="py-3 px-4 text-sm text-gray-500 font-medium text-gray-800">
                  {renderPaymentMethodName(method)}
                </td>

                <td className="py-3 px-4 text-sm text-gray-500 align-center">
                  {renderBankInfo(method)}
                </td>

                <td className="py-3 px-4 text-sm text-gray-500">
                  <div className="text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto pr-1">
                    {method.note || "-"}
                  </div>
                </td>

                <td className="py-3 px-4 text-sm text-gray-500">
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

                <td className="py-3 px-4 text-sm text-gray-500">
                  {formatDate(method.createdAt)}
                </td>

                <td className="py-3 px-4 space-x-5 text-sm flex items-center text-nowrap">
                  <button onClick={() => onEdit(method)}>
                    <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />
                  </button>

                  <button
                    onClick={() => onDelete(method.id)}
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

export default PaymentMethodList;