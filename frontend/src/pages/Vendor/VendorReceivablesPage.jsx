import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosInstance";

const fmtNum = (v) =>
  v !== undefined && v !== null && v !== "" ? Number(v).toFixed(2) : "";

const VendorReceivablesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/vendor-receivables", { withCredentials: true });
        setData(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch receivables");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Compute totals grouped by currency
  const totals = {};
  data.forEach((row) => {
    const code = row.currency?.currency?.code || "—";
    totals[code] = (totals[code] || 0) + Number(row.subtotal || 0);
  });

  const HEADERS = [
    "Code",
    "Invoice",
    "Job service",
    "Job language pair",
    "Unit amount",
    "Unit",
    "Price per unit",
    "Subtotal",
    "Extra charge",
    "Discount",
    "Total",
    "Currency",
    "Note for vendor",
    "Job",
    "Job status",
  ];

  const getLangPair = (row) => {
    const lp = row.job?.languagePair;
    if (!lp) return "—";
    return `${lp.sourceLanguage?.name || ""} - ${lp.targetLanguage?.name || ""}`;
  };

  const handleExportToExcel = () => {
    alert("Excel export feature coming soon!");
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-medium">{error}</div>;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-700 uppercase">Receivables</h2>
        <button
          className="bg-white hover:bg-gray-200 text-black text-sm px-3 py-2 rounded shadow border border-gray-300"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Showing <strong>1-{data.length}</strong> of <strong>{data.length}</strong> items.
      </p>

      {/* Table */}
      <div className="w-full bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-xs min-w-[1200px]">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold border-b">
                {HEADERS.map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length} className="py-8 text-center text-gray-400">
                    No receivables found.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => {
                  const isFlat = row.type === "flat_rate";
                  const currCode = row.currency?.currency?.code || "—";

                  return (
                    <tr
                      key={`${row.type}-${row.id}`}
                      className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                    >
                      {/* Code */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Link
                          to={`/vendor/receivable/${row.id}?type=${row.type}`}
                          className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          WL{row.id}
                        </Link>
                      </td>
                      {/* Invoice */}
                      <td className="px-3 py-2">—</td>
                      {/* Job service */}
                      <td className="px-3 py-2">{row.job?.service?.name || "—"}</td>
                      {/* Job language pair */}
                      <td className="px-3 py-2 whitespace-nowrap">{getLangPair(row)}</td>
                      {/* Unit amount */}
                      <td className="px-3 py-2 text-right">{isFlat ? "" : fmtNum(row.unit_amount)}</td>
                      {/* Unit */}
                      <td className="px-3 py-2">{isFlat ? "" : row.unit?.name || ""}</td>
                      {/* Price per unit */}
                      <td className="px-3 py-2 text-right">{isFlat ? "" : fmtNum(row.price_per_unit)}</td>
                      {/* Subtotal */}
                      <td className="px-3 py-2 text-right">{fmtNum(row.subtotal)}</td>
                      {/* Extra charge */}
                      <td className="px-3 py-2 text-right"></td>
                      {/* Discount */}
                      <td className="px-3 py-2 text-right"></td>
                      {/* Total */}
                      <td className="px-3 py-2 text-right font-semibold">{fmtNum(row.subtotal)}</td>
                      {/* Currency */}
                      <td className="px-3 py-2">{currCode}</td>
                      {/* Note for vendor */}
                      <td className="px-3 py-2 max-w-[200px] truncate" title={row.note_for_vendor || ""}>
                        {row.note_for_vendor || ""}
                      </td>
                      {/* Job */}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Link
                          to={`/vendor/job/${row.job_id}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          LT{row.job_id}
                        </Link>
                      </td>
                      {/* Job status */}
                      <td className="px-3 py-2 whitespace-nowrap">{row.job?.status || "—"}</td>
                    </tr>
                  );
                })
              )}

              {/* Totals row */}
              {data.length > 0 && (
                <tr className="bg-gray-50 font-semibold border-t-2">
                  <td colSpan={10} className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right">
                    {Object.entries(totals).map(([code, total]) => (
                      <div key={code}>{fmtNum(total)}</div>
                    ))}
                  </td>
                  <td className="px-3 py-2 font-bold">
                    {Object.keys(totals).map((code) => (
                      <div key={code}>{code}</div>
                    ))}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VendorReceivablesPage;
