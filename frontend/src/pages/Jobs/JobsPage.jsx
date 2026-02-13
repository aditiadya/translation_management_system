import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import JobsTable from "./JobsTable";

const JobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs", { withCredentials: true });
        setJobs(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleBulkAction = async (action) => {
    if (selectedJobs.length === 0) {
      alert("Please select at least one job");
      return;
    }

    // TODO: Implement bulk actions
    console.log(`Performing ${action} on jobs:`, selectedJobs);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`, { withCredentials: true });
      setJobs(jobs.filter((job) => job.id !== jobId));
      alert("Job deleted successfully");
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Failed to delete job");
    }
  };

  const handleCloneJob = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    navigate(`/project/${job.project_id}/create-job?clone=${jobId}`);
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    navigate(`/project/${job.project_id}/job/${jobId}/edit`);
  };

  const refreshJobs = async () => {
    try {
      const response = await api.get("/jobs", { withCredentials: true });
      setJobs(response.data.data || []);
    } catch (err) {
      console.error("Failed to refresh jobs:", err);
    }
  };

  const handleExportToExcel = () => {
    // TODO: Implement Excel export
    console.log("Exporting to Excel...");
    alert("Excel export feature coming soon!");
  };

  return (
    <>
      <div className="flex justify-between items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Jobs ({jobs.length})
        </h2>
        <div className="flex gap-3 items-center">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("offer")}
            disabled={selectedJobs.length === 0}
            title="Offer selected jobs to vendor"
          >
            Offer
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("start")}
            disabled={selectedJobs.length === 0}
            title="Start selected jobs"
          >
            Start
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("accept")}
            disabled={selectedJobs.length === 0}
            title="Accept completion of selected jobs"
          >
            Accept
          </button>

          <button
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-2 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("cancel")}
            disabled={selectedJobs.length === 0}
            title="Cancel selected jobs"
          >
            Cancel
          </button>

          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-2 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleBulkAction("draft")}
            disabled={selectedJobs.length === 0}
            title="Move selected jobs to draft"
          >
            Draft
          </button>

          <div className="mx-2 h-8 w-px bg-gray-400"></div>

          <button
            className="bg-white hover:bg-gray-200 text-black text-sm px-3 py-2 rounded shadow border border-gray-300"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </button>

        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">{error}</div>
      ) : (
        <JobsTable
          data={jobs}
          selectedJobs={selectedJobs}
          setSelectedJobs={setSelectedJobs}
          onDelete={handleDeleteJob}
          onClone={handleCloneJob}
          onEdit={handleEditJob}
          onRefresh={refreshJobs}
        />
      )}
    </>
  );
};

export default JobsPage;