import { Pencil, Trash2, Copy } from "lucide-react";

const TYPE_STYLES = {
  flat_rate:   "border-l-2 border-violet-400",
  unit_based:  "border-l-2 border-sky-400",
};

const TYPE_BADGE = {
  flat_rate:  { label: "Flat",  cls: "bg-violet-100 text-violet-700" },
  unit_based: { label: "Unit",  cls: "bg-sky-100 text-sky-700" },
};

const ReceivablesTable = ({
  data = [],
  onEdit,
  onDelete,
  onClone,
}) => {
  /* ── helpers ── */
  const formatLanguagePair = (lp) => {
    if (!lp) return "—";
    const src = lp.sourceLanguage?.name || lp.sourceLanguage?.code || "";
    const tgt = lp.targetLanguage?.name || lp.targetLanguage?.code || "";
    return src && tgt ? `${src} → ${tgt}` : "—";
  };

  const formatCurrency = (c) => c?.currency?.code || "—";

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString(); } catch { return "—"; }
  };

  const fmt = (v, fallback = "—") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

  const fmtNum = (v, fallback = "0.00") =>
    v !== undefined && v !== null && v !== "" ? v : fallback;

  /* ── columns ── */
  const HEADERS = [
    "Type",
    "Code",
    "Invoice",
    "PO Number",
    "Service",
    "Language Pair",
    "Unit Amount",
    "Unit",
    "Price / Unit",
    "Subtotal",
    "Extra",
    "Discount",
    "Total",
    "Currency",
    "CAT",
    "Filename",
    "Internal Note",
    "Issued At",
    "Actions",
  ];

  const COL_WIDTHS = [
    "4%",   // Type
    "4%",   // Code
    "4%",   // Invoice
    "7%",   // PO Number
    "9%",   // Service
    "11%",  // Language Pair
    "4%",   // Unit Amount
    "4%",   // Unit
    "5%",   // Price / Unit
    "4%",   // Subtotal
    "5%",   // Extra
    "4%",   // Discount
    "3%",   // Total
    "5%",   // Currency
    "3%",   // CAT
    "10%",  // Filename
    "7%",   // Internal Note
    "6%",   // Issued At
    "7%",   // Actions
  ];

  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b bg-gray-50 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-3 rounded-sm bg-violet-400" />
          Flat Rate
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-3 rounded-sm bg-sky-400" />
          Unit Based
        </span>
      </div>

      <div className="max-h-[460px] overflow-y-auto overflow-x-auto">
        <table className="w-full table-auto border-collapse min-w-[1400px]">
          <colgroup>
            {COL_WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr className="bg-white border-b text-[10px] tracking-widest text-gray-500 uppercase">
              {HEADERS.map((h) => (
                <th key={h} className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="py-10 text-center text-gray-400 text-xs">
                  No receivables found.
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const isFlat = row.type === "flat_rate";
                const badge  = TYPE_BADGE[row.type] ?? TYPE_BADGE.flat_rate;
                const typeStyle = TYPE_STYLES[row.type] ?? "";
                const rowBg = index % 2 === 0 ? "bg-gray-50" : "bg-white";

                return (
                  <tr
                    key={`${row.type}-${row.id}`}
                    className={`${rowBg} ${typeStyle} hover:bg-blue-50 transition-colors`}
                  >
                    {/* Type badge */}
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-xs text-blue-600 whitespace-nowrap">
                      {fmt(row.code)}
                    </td>

                    {/* Invoice — empty for now */}
                    <td className="px-3 py-2 text-xs text-gray-400 whitespace-nowrap">—</td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {fmt(row.po_number)}
                    </td>

                    <td className="px-3 py-2 text-xs break-words">
                      {row.service?.name || fmt(row.service)}
                    </td>

                    <td className="px-3 py-2 text-xs break-words">
                      {formatLanguagePair(row.languagePair)}
                    </td>

                    {/* Unit Amount — only unit_based */}
                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {isFlat ? <span className="text-gray-300">—</span> : fmt(row.unit_amount)}
                    </td>

                    {/* Unit — only unit_based */}
                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {isFlat
                        ? <span className="text-gray-300">—</span>
                        : (row.unit?.name || fmt(row.unit))}
                    </td>

                    {/* Price per Unit — only unit_based */}
                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {isFlat ? <span className="text-gray-300">—</span> : fmt(row.price_per_unit)}
                    </td>

                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {fmtNum(row.subtotal)}
                    </td>

                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {fmtNum(row.extra_charge)}
                    </td>

                    <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                      {fmtNum(row.discount)}
                    </td>

                    <td className="px-3 py-2 text-xs font-semibold text-right whitespace-nowrap">
                      {fmtNum(row.total )}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {formatCurrency(row.currency)}
                    </td>

                    {/* CAT — empty for now */}
                    <td className="px-3 py-2 text-xs text-gray-400 whitespace-nowrap">—</td>

                    <td className="px-3 py-2 text-xs break-words">
                      {row.file?.file_name || fmt(row.file_name)}
                    </td>

                    <td className="px-3 py-2 text-xs text-gray-600 break-words">
                      {fmt(row.internal_note)}
                    </td>

                    <td className="px-3 py-2 text-xs whitespace-nowrap">
                      {formatDate(row.createdAt) !== "—"
                        ? formatDate(row.createdAt)
                        : formatDate(row.issued_at)}
                    </td>

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

export default ReceivablesTable;