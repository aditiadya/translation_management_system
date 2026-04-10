import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import VendorJobsTable from "./VendorJobsTable";

const VendorJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/vendor-jobs", { withCredentials: true });
      setJobs(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleExportToExcel = () => {
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
        <VendorJobsTable data={jobs} onRefresh={fetchJobs} />
      )}
    </>
  );
};

export default VendorJobsPage;
