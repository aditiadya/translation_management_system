import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../../utils/axiosInstance";
import PayablesTable from "../../../../Projects/ProjectDetails/Finances/Tables/PayablesTable";

const PayablesToVendorCard = ({ job }) => {
  const { id: projectId, jobId } = useParams();
  const navigate = useNavigate();

  const [payables, setPayables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [jobMeta, setJobMeta] = useState({ client_id: null, vendor_id: null });
  const dropdownRef = useRef(null);

  /* ── Fetch job meta once (for clone) ── */

  useEffect(() => {
    if (!jobId) return;
    api.get(`/jobs/${jobId}`)
      .then((res) => {
        const jobData = res.data.data;
        setJobMeta({
          client_id: jobData.project?.client_id,
          vendor_id: jobData.vendor_id,
        });
      })
      .catch((err) => console.error("Failed to fetch job meta", err));
  }, [jobId]);

  /* ── Fetch payables filtered by this job ── */

  const fetchPayables = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/project-finances/payables/merged?project_id=${projectId}&job_id=${jobId}`
      );
      if (data.success) setPayables(data.data);
    } catch (err) {
      console.error("Failed to fetch payables", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && jobId) fetchPayables();
  }, [projectId, jobId]);

  /* ── Click outside dropdown ── */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Handlers ── */

  const handleEdit = (row) => {
    if (row.type === "flat_rate") {
      navigate(`/project/${projectId}/job/${jobId}/edit-flat-rate-receivable/${row.id}`);
    } else {
      navigate(`/project/${projectId}/job/${jobId}/edit-unit-based-receivable/${row.id}`);
    }
  };

  const handleDelete = async (row) => {
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

  const handleClone = async (row) => {
    const endpoint = row.type === "flat_rate"
      ? `/project-finances/flat-rate-payables`
      : `/project-finances/unit-based-payables`;

    const {
      id, createdAt, updatedAt, type,
      project, job, currency, unit, file,
      ...payload
    } = row;

    try {
      const { data } = await api.post(endpoint, {
        ...payload,
        project_id: Number(projectId),
        job_id: Number(jobId),
        client_id: jobMeta.client_id,
        vendor_id: jobMeta.vendor_id,
      });
      if (data.success) fetchPayables();
    } catch (err) {
      console.error("Clone failed", err);
    }
  };

  const goTo = (path) => {
    setOpen(false);
    navigate(`/project/${projectId}/job/${jobId}/${path}`);
  };

  return (
    <div className="bg-white shadow rounded-lg space-y-4">
      <div className="flex justify-between items-start pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Payables to Vendor
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
          >
            New Payable <span className="text-xs">▾</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => goTo("new-flat-rate-receivable")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Flat Rate Payable
              </button>
              <button
                onClick={() => goTo("new-unit-based-receivable")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Unit Based Payable
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
      </div>

      {loading
        ? <div className="text-sm text-gray-400 py-6 text-center">Loading payables...</div>
        : <PayablesTable
            data={payables}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClone={handleClone}
          />
      }
    </div>
  );
};

export default PayablesToVendorCard;