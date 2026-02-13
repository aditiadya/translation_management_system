import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";
import JobsTable from "./JobsTable";

const JobsPage = () => {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { id: projectId } = useParams();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch jobs for the project
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${projectId}/jobs`, {
          withCredentials: true,
        });
        setJobs(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchJobs();
    }
  }, [projectId]);

  const goTo = (path) => {
    setOpen(false);
    navigate(`/project/${projectId}/${path}`);
  };

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
    // TODO: Implement job cloning
    console.log("Cloning job:", jobId);
    navigate(`/project/${projectId}/create-job?clone=${jobId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/project/${projectId}/job/${jobId}/edit`);
  };

  const refreshJobs = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/jobs`, {
        withCredentials: true,
      });
      setJobs(response.data.data || []);
    } catch (err) {
      console.error("Failed to refresh jobs:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading jobs...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Project Jobs ({jobs.length})
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

            <button
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => handleBulkAction("delete")}
              disabled={selectedJobs.length === 0}
              title="Delete selected jobs"
            >
              Delete
            </button>

            <div className="mx-2 h-8 w-px bg-gray-400"></div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow"
              onClick={() => navigate(`/project/${projectId}/create-job`)}
            >
              New Job
            </button>

            
          </div>
        </div>

        <JobsTable
          data={jobs}
          selectedJobs={selectedJobs}
          setSelectedJobs={setSelectedJobs}
          onDelete={handleDeleteJob}
          onClone={handleCloneJob}
          onEdit={handleEditJob}
          onRefresh={refreshJobs}
        />
      </section>
    </div>
  );
};

export default JobsPage;