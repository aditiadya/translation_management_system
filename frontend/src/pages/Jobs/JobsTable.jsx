import { Pencil, Trash2, Copy } from "lucide-react";

const JobsTable = ({ data = [] }) => {
  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">

          {/* Column width control */}
          <colgroup>
            <col style={{ width: "2%" }} />  
            <col style={{ width: "20%" }} />  
            <col style={{ width: "5%" }} />  
            <col style={{ width: "10%" }} />
            <col style={{ width: "6%" }} />   
            <col style={{ width: "8%" }} />   
            <col style={{ width: "5%" }} />   
            <col style={{ width: "4%" }} />   
            <col style={{ width: "5%" }} />   
            <col style={{ width: "5%" }} />  
            <col style={{ width: "5%" }} />   
            <col style={{ width: "5%" }} />   
            <col style={{ width: "5%" }} />   
            <col style={{ width: "5%" }} />   
          </colgroup>

          <thead>
            <tr className="bg-white text-black-600 text-[11px] tracking-widest border-b">
              {[
                "Code",
                "Name",
                "Service",
                "Language Pair",
                "Deadline At",
                "Vendor",
                "Status",
                "Start At",
                "Completed At",
                "Work Amount",
                "Payables, INR",
                "Project",
                "Primary Project Manager",
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
                  colSpan={18}
                  className="py-6 text-center text-gray-500 text-xs"
                >
                  No jobs found.
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

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {row.po_number}
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
  );
};

export default JobsTable;