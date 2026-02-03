import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import JobsTable from "./JobsTable";

const JobsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects", { withCredentials: true });
        setProjects(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="flex justify-between items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Jobs</h2>
        <div className="flex gap-3 items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Offer
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Start
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded shadow">
              Accept
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Cancel
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded shadow">
              Draft
            </button>

            <div className="mx-2 h-8 w-px bg-gray-400"></div>

            <button className="bg-white-600 hover:bg-gray-200 text-black text-sm px-3 py-2 rounded shadow border border-gray-300">
              Export to Excel
            </button>

          </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">{error}</div>
      ) : (
        <JobsTable />
      )}
    </>
  );
};

export default JobsPage;
