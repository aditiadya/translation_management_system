import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReceivablesTable from "./Tables/ReceivablesTable";
import PayablesTable from "./Tables/PayablesTable";
import FinanceSummaryTable from "./Tables/FinanceSummaryTable";

const FinancePage = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { id: projectId } = useParams(); // /project/:id/finance

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goTo = (path) => {
    setOpen(false);
    navigate(`/project/${projectId}/${path}`);
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Receivables from Client
          </h2>

          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Add to New Invoice
            </button>

            {/* New Receivable Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow flex items-center gap-2"
              >
                New Receivable
                <span className="text-xs">▾</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => goTo("new-flat-rate-receivable")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Flat Rate Receivables
                  </button>

                  <button
                    onClick={() => goTo("new-unit-based-receivable")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Unit Based Receivables
                  </button>

                  <button
                    onClick={() => goTo("new-cat-log")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    CAT Log
                  </button>
                </div>
              )}
            </div>

            <button className="bg-gray-600 text-white text-sm px-3 py-2 rounded shadow hover:bg-gray-700">
              Export to Excel
            </button>
          </div>
        </div>

        <ReceivablesTable />
      </section>

      {/* Payables */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Payables to Vendor
          </h2>

          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Add to New Invoice
            </button>

            <button className="bg-gray-600 text-white text-sm px-3 py-2 rounded shadow hover:bg-gray-700">
              Export to Excel
            </button>
          </div>
        </div>

        <PayablesTable />
      </section>

      {/* Summary */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Project Finance Summary
          </h2>
        </div>

        <FinanceSummaryTable />
      </section>
    </div>
  );
};

export default FinancePage;