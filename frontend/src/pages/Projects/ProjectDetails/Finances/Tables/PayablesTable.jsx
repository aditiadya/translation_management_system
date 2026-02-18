import { Pencil, Trash2, Copy } from "lucide-react";

const TYPE_STYLES = {
  flat_rate: "border-l-2 border-amber-400",
  unit_based: "border-l-2 border-teal-400",
};

const TYPE_BADGE = {
  flat_rate: { label: "Flat", cls: "bg-amber-100 text-amber-700" },
  unit_based: { label: "Unit", cls: "bg-teal-100 text-teal-700" },
};

const PayablesTable = ({ data = [], onEdit, onDelete, onClone }) => {
  const fmt = (v, fallback = "—") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

  const fmtNum = (v, fallback = "0.00") =>
    v !== undefined && v !== null && v !== "" ? Number(v).toFixed(2) : fallback;

  const formatCurrency = (c) => c?.currency?.code || "—";

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    } catch {
      return "—";
    }
  };

  const HEADERS = [
    "Type", // ← add
    "Code",
    "Invoice",
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
    "Note for Vendor",
    "Internal Note",
    "Issued At",
    "Actions",
  ];

  const COL_WIDTHS = [
    "3%", // Type  ← add
    "4%", // Code
    "4%", // Invoice
    "5%", // Unit Amount
    "5%", // Unit
    "6%", // Price per Unit
    "5%", // Subtotal
    "5%", // Extra Charge
    "5%", // Discount
    "5%", // Total
    "6%", // Currency
    "4%", // CAT Log
    "9%", // Filename
    "7%", // Note for Vendor
    "7%", // Internal Note
    "7%", // Issued At
    "6%", // Actions
  ];

  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b bg-gray-50 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-3 rounded-sm bg-amber-400" />
          Flat Rate
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-3 rounded-sm bg-teal-400" />
          Unit Based
        </span>
      </div>

      <div className=" max-h-[250px] overflow-y-auto">
        <table className="w-full table-auto border-collapse min-w-[1200px]">
          <colgroup>
            {COL_WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr className="bg-white border-b text-[10px] tracking-widest text-gray-500 uppercase">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-center font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={HEADERS.length}
                  className="py-10 text-center text-gray-400 text-xs"
                >
                  No payables found.
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const isFlat = row.type === "flat_rate";
                const badge = TYPE_BADGE[row.type] ?? TYPE_BADGE.flat_rate;
                const typeStyle = TYPE_STYLES[row.type] ?? "";
                const rowBg = index % 2 === 0 ? "bg-gray-50" : "bg-white";

                return (
                  <tr
                    key={`${row.type}-${row.id}`}
                    className={`${rowBg} ${typeStyle} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Code — empty for now */}
                    <td className="px-3 py-2 text-xs text-blue-600 whitespace-nowrap">
                      {fmt(row.code)}
                    </td>

                    {/* Invoice — empty for now */}
                    <td className="px-3 py-2 text-xs text-gray-400 whitespace-nowrap">
                      —
                    </td>

                    {/* Unit Amount — flat rate shows — */}
                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {isFlat ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        fmt(row.unit_amount)
                      )}
                    </td>

                    {/* Unit — flat rate shows — */}
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {isFlat ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        row.unit?.name || fmt(row.unit)
                      )}
                    </td>

                    {/* Price per Unit — flat rate shows — */}
                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {isFlat ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        fmt(row.price_per_unit)
                      )}
                    </td>

                    {/* Subtotal */}
                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {fmtNum(row.subtotal)}
                    </td>

                    {/* Extra Charge — empty for now */}
                    <td className="px-3 py-2 text-xs text-gray-400 text-right whitespace-nowrap">
                      —
                    </td>

                    {/* Discount — empty for now */}
                    <td className="px-3 py-2 text-xs text-gray-400 text-right whitespace-nowrap">
                      —
                    </td>

                    {/* Total — empty for now */}
                    <td className="px-3 py-2 text-xs font-semibold text-gray-400 text-right whitespace-nowrap">
                      —
                    </td>

                    {/* Currency */}
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {formatCurrency(row.currency)}
                    </td>

                    {/* CAT Log — empty for now */}
                    <td className="px-3 py-2 text-xs text-gray-400 whitespace-nowrap">
                      —
                    </td>

                    {/* Filename */}
                    <td className="px-3 py-2 text-xs break-words">
                      {row.file?.file_name || fmt(row.file?.file_code)}
                    </td>

                    {/* Note for Vendor */}
                    <td className="px-3 py-2 text-xs text-gray-600 break-words">
                      {fmt(row.note_for_vendor)}
                    </td>

                    {/* Internal Note */}
                    <td className="px-3 py-2 text-xs text-gray-600 break-words">
                      {fmt(row.internal_note)}
                    </td>

                    {/* Issued At — DD/MM/YYYY HH:MM */}
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-3">
                        <Copy
                          className="w-4 h-4 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                          title="Clone"
                          onClick={() => onClone?.(row)}
                        />
                        <Pencil
                          className="w-4 h-4 text-blue-400 hover:text-blue-600 cursor-pointer transition-colors"
                          title="Edit"
                          onClick={() => onEdit?.(row)}
                        />
                        <Trash2
                          className="w-4 h-4 text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                          title="Delete"
                          onClick={() => onDelete?.(row)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayablesTable;
