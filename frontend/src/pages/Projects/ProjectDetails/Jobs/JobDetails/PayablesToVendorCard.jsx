import { Pencil, Trash2, Copy } from "lucide-react";

const PayablesToVendorCard = ({ data = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg space-y-4">
        <div className="flex justify-between items-start pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Payables To Vendors
        </h3>
        <button
            
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            New Payable
          </button>
      </div>

    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">

          {/* Column width control */}
          <colgroup>
            <col style={{ width: "4%" }} />   {/* Code */}
            <col style={{ width: "4%" }} />   {/* Invoice */}
            <col style={{ width: "5%" }} />   {/* Job */}
            <col style={{ width: "6%" }} />  {/* Vendor */}
            <col style={{ width: "6%" }} />  {/* Service */}
            <col style={{ width: "8%" }} />  {/* Language Pair */}
            <col style={{ width: "6%" }} />   {/* Units */}
            <col style={{ width: "4%" }} />   {/* Unit */}
            <col style={{ width: "5%" }} />   {/* Price */}
            <col style={{ width: "5%" }} />   {/* Subtotal */}
            <col style={{ width: "4%" }} />   {/* Extra */}
            <col style={{ width: "4%" }} />   {/* Discount */}
            <col style={{ width: "4%" }} />   {/* Total */}
            <col style={{ width: "6%" }} />   {/* Currency */}
            <col style={{ width: "3%" }} />   {/* Cat Log */}
            <col style={{ width: "18%" }} />  {/* File */}
            <col style={{ width: "7%" }} />  {/* Internal Note */}
            <col style={{ width: "7%" }} />   {/* Issued */}
            <col style={{ width: "6%" }} />   {/* Actions */}
          </colgroup>

          <thead>
            <tr className="bg-gray-50 text-black-600 text-[11px] tracking-widest border-b">
              {[
                "Code",
                "Included in invoice",
                "Job",
                "Job Vendor",
                "Job Service",
                "Job Language Pair",
                "Unit Amount",
                "Unit",
                "Price per Unit",
                "Subtotal",
                "Extra Charge",
                "Discount",
                "Total",
                "Currency",
                "CAT Log",
                "Filename",
                "Internal Note",
                "Issued at",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-center font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={19}
                  className="py-6 text-center text-gray-500 text-xs"
                >
                  No payables found.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "hover:bg-gray-100"
                  }
                >
                  <td className="px-3 py-2 text-xs text-blue-600 whitespace-nowrap">
                    {row.code}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {row.invoice}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.job}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.vendor}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.service}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.language_pair}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.unit_amount}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {row.unit}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.price_per_unit}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.subtotal}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.extra_charge}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.discount}
                  </td>

                  <td className="px-3 py-2 text-xs font-semibold text-right whitespace-nowrap">
                    {row.total}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {row.currency}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {row.catalog}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.file_name}
                  </td>

                  <td className="px-3 py-2 text-xs text-gray-600 break-words">
                    {row.internal_note || "—"}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {row.issued_at || "—"}
                  </td>

                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-3">
                      <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                      <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-pointer" />
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default PayablesToVendorCard;