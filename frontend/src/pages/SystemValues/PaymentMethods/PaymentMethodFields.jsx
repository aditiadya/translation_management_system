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

  if (!methods || methods.length === 0) {
    return null;
  }

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
          {methods.map((method, index) => (
            <tr
              key={method.id}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              <td className="py-3 px-4 text-sm text-gray-500 capitalize">
                {method.payment_method.replace("_", " ")}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaymentMethodFields = ({ formData, handleChange }) => {
  if (!formData) return null;

  const paymentMethod = formData.payment_method;

  // If no payment method is selected, show a message
  if (!paymentMethod) {
    return (
      <div className="text-center text-gray-500 py-4">
        Please select a payment method first
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethod === "bank_transfer" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="payment_method_name"
              value={formData.payment_method_name || ""}
              onChange={handleChange}
              placeholder="e.g., Company Bank Account"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiary Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="beneficiary_name"
              value={formData.beneficiary_name || ""}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiary Address
            </label>
            <input
              type="text"
              name="beneficiary_address"
              value={formData.beneficiary_address || ""}
              onChange={handleChange}
              placeholder="Street address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name || ""}
              onChange={handleChange}
              placeholder="e.g., Chase Bank"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number || ""}
              onChange={handleChange}
              placeholder="Your account number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              name="ifsc_code"
              value={formData.ifsc_code || ""}
              onChange={handleChange}
              placeholder="IFSC code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SWIFT
            </label>
            <input
              type="text"
              name="swift"
              value={formData.swift || ""}
              onChange={handleChange}
              placeholder="SWIFT code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN
            </label>
            <input
              type="text"
              name="iban"
              value={formData.iban || ""}
              onChange={handleChange}
              placeholder="IBAN"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Code
            </label>
            <input
              type="text"
              name="sort_code"
              value={formData.sort_code || ""}
              onChange={handleChange}
              placeholder="Sort code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Address
            </label>
            <input
              type="text"
              name="bank_address"
              value={formData.bank_address || ""}
              onChange={handleChange}
              placeholder="Bank address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              placeholder="Country"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State / Region
            </label>
            <input
              type="text"
              name="state_region"
              value={formData.state_region || ""}
              onChange={handleChange}
              placeholder="State or region"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code || ""}
              onChange={handleChange}
              placeholder="Postal code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      {["paypal", "payoneer", "skrill"].includes(paymentMethod) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      )}

      {paymentMethod === "other" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="payment_method_name"
            value={formData.payment_method_name || ""}
            onChange={handleChange}
            placeholder="e.g., Cryptocurrency, Check, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      )}
    </div>
  );
};

export { PaymentMethodList };
export default PaymentMethodFields;