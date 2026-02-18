import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";
import ReceivablesTable from "./Tables/ReceivablesTable";
import PayablesTable from "./Tables/PayablesTable";
import FinanceSummaryTable from "./Tables/FinanceSummaryTable";

const FinancePage = () => {
  const [receivablesOpen, setReceivablesOpen] = useState(false);

  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);

  const [receivablesLoading, setReceivablesLoading] = useState(true);
  const [payablesLoading, setPayablesLoading] = useState(true);

  const receivablesDropdownRef = useRef(null);

  const navigate = useNavigate();
  const { id: projectId } = useParams();

  /* ── Receivables ── */

  const fetchReceivables = async () => {
    setReceivablesLoading(true);
    try {
      const { data } = await api.get(`/project-finances/receivables/merged?project_id=${projectId}`);
      if (data.success) setReceivables(data.data);
    } catch (err) {
      console.error("Failed to fetch receivables", err);
    } finally {
      setReceivablesLoading(false);
    }
  };

  const handleEditReceivable = (row) => {
    if (row.type === "flat_rate") {
      navigate(`/project/${projectId}/edit-flat-rate-receivable/${row.id}`);
    } else {
      navigate(`/project/${projectId}/edit-unit-based-receivable/${row.id}`);
    }
  };

  const handleDeleteReceivable = async (row) => {
    const endpoint = row.type === "flat_rate"
      ? `/project-finances/flat-rate-receivables/${row.id}`
      : `/project-finances/unit-based-receivables/${row.id}`;

    if (!window.confirm("Delete this receivable?")) return;
    try {
      const { data } = await api.delete(endpoint);
      if (data.success) fetchReceivables();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCloneReceivable = async (row) => {
    const endpoint = row.type === "flat_rate"
      ? `/project-finances/flat-rate-receivables`
      : `/project-finances/unit-based-receivables`;

    const {
      id, createdAt, updatedAt, type,
      project, service, languagePair, currency, unit, file,
      ...payload
    } = row;

    try {
      const { data } = await api.post(endpoint, { ...payload, project_id: Number(projectId) });
      if (data.success) fetchReceivables();
    } catch (err) {
      console.error("Clone receivable failed", err);
    }
  };

  /* ── Payables ── */

  const fetchPayables = async () => {
    setPayablesLoading(true);
    try {
      const { data } = await api.get(`/project-finances/payables/merged?project_id=${projectId}`);
      if (data.success) setPayables(data.data);
    } catch (err) {
      console.error("Failed to fetch payables", err);
    } finally {
      setPayablesLoading(false);
    }
  };

  const handleEditPayable = (row) => {
    const jobId = row.job_id;
    if (row.type === "flat_rate") {
      navigate(`/project/${projectId}/job/${jobId}/edit-flat-rate-receivable/${row.id}`);
    } else {
      navigate(`/project/${projectId}/job/${jobId}/edit-unit-based-receivable/${row.id}`);
    }
  };

  const handleDeletePayable = async (row) => {
    const endpoint = row.type === "flat_rate"
      ? `/project-finances/flat-rate-payables/${row.id}`
      : `/project-finances/unit-based-payables/${row.id}`;

    if (!window.confirm("Delete this payable?")) return;
    try {
      const { data } = await api.delete(endpoint);
      if (data.success) fetchPayables();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleClonePayable = async (row) => {
    const endpoint = row.type === "flat_rate"
      ? `/project-finances/flat-rate-payables`
      : `/project-finances/unit-based-payables`;

    const {
      id, createdAt, updatedAt, type,
      project, job, currency, unit, file,
      ...payload
    } = row;

    try {
      // Fetch job to get client_id and vendor_id
      const jobRes = await api.get(`/jobs/${row.job_id}`);
      const jobData = jobRes.data.data;

      const { data } = await api.post(endpoint, {
        ...payload,
        project_id: Number(projectId),
        job_id: row.job_id,
        client_id: jobData.project?.client_id,
        vendor_id: jobData.vendor_id,
      });
      if (data.success) fetchPayables();
    } catch (err) {
      console.error("Clone payable failed", err);
    }
  };

  /* ── Init ── */

  useEffect(() => {
    if (projectId) {
      fetchReceivables();
      fetchPayables();
    }
  }, [projectId]);

  /* ── Click outside dropdown ── */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (receivablesDropdownRef.current && !receivablesDropdownRef.current.contains(e.target))
        setReceivablesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goTo = (path) => {
    setReceivablesOpen(false);
    navigate(`/project/${projectId}/${path}`);
  };

  return (
    <div className="space-y-8">

      {/* ── Receivables ── */}
      <section>
        <div className="flex justify-between items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-gray-900">Receivables from Client</h2>
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Add to New Invoice
            </button>
            <div className="relative" ref={receivablesDropdownRef}>
              <button
                onClick={() => setReceivablesOpen((prev) => !prev)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow flex items-center gap-2"
              >
                New Receivable <span className="text-xs">▾</span>
              </button>
              {receivablesOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button onClick={() => goTo("new-flat-rate-receivable")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Flat Rate Receivable</button>
                  <button onClick={() => goTo("new-unit-based-receivable")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Unit Based Receivable</button>
                  <button onClick={() => goTo("new-cat-log")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">CAT Log</button>
                </div>
              )}
            </div>
            <button className="bg-gray-600 text-white text-sm px-3 py-2 rounded shadow hover:bg-gray-700">
              Export to Excel
            </button>
          </div>
        </div>

        {receivablesLoading
          ? <div className="text-sm text-gray-400 py-6 text-center">Loading receivables...</div>
          : <ReceivablesTable data={receivables} onEdit={handleEditReceivable} onDelete={handleDeleteReceivable} onClone={handleCloneReceivable} />
        }
      </section>

      {/* ── Payables ── */}
      <section>
        <div className="flex justify-between items-center gap-3 mb-5">
          <h2 className="text-xl font-bold text-gray-900">Payables to Vendor</h2>
          <button className="bg-gray-600 text-white text-sm px-3 py-2 rounded shadow hover:bg-gray-700">
            Export to Excel
          </button>
        </div>

        {payablesLoading
          ? <div className="text-sm text-gray-400 py-6 text-center">Loading payables...</div>
          : <PayablesTable
              data={payables}
              onEdit={handleEditPayable}
              onDelete={handleDeletePayable}
              onClone={handleClonePayable}
            />
        }
      </section>

      {/* ── Summary ── */}
      {/* <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">Project Finance Summary</h2>
        </div>
        <FinanceSummaryTable />
      </section> */}
    </div>
  );
};

export default FinancePage;