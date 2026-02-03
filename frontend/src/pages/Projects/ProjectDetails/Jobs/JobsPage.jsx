import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobsTable from "./JobsTable";

const JobsPage = () => {
  const [open, setOpen] = useState(false);
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

  const goTo = (path) => {
    setOpen(false);
    navigate(`/project/${projectId}/${path}`);
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-gray-900">Project Jobs</h2>

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

            <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded shadow">
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
        <JobsTable />
      </section>
    </div>
  );
};

export default JobsPage;
