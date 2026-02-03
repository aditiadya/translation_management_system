import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axiosInstance";

const ProjectsPage = () => {
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
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={() => navigate("/projects/create-project")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
        >
          Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">{error}</div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-white text-black uppercase text-sm">
                <th className="py-3 px-6 text-center">Code</th>
                <th className="py-3 px-6 text-center">Project Name</th>
                <th className="py-3 px-6 text-center">Client</th>
                <th className="py-3 px-6 text-center">Start Date</th>
                <th className="py-3 px-6 text-center">Deadline</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Primary Manager</th>
                <th className="py-3 px-6 text-center">Total to recieve, INR</th>
                <th className="py-3 px-6 text-center">Total to pay, INR</th>
                <th className="py-3 px-6 text-center">Profit Margin, %</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "hover:bg-gray-100"
                  }
                >
                  {/* Code */}
                  <td className="py-4 px-6 text-sm text-gray-700 text-center">
                    #{project.id}
                  </td>

                  {/* Project Name */}
                  <td className="py-4 px-6 text-sm text-blue-600 text-center underline hover:text-indigo-600 whitespace-nowrap">
                    <Link to={`/project/${project.id}`}>
                      {project.project_name}
                    </Link>
                  </td>

                  {/* Client */}
                  <td className="py-4 px-6 text-sm text-gray-700 text-center">
                    {project.client?.company_name || "-"}
                  </td>

                  {/* Start Date */}
                  <td className="py-4 px-6 text-sm text-gray-700 text-center">
                    {project.start_at ? formatDate(project.start_at) : "-"}
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-6 text-sm text-gray-700 text-center">
                    {project.deadline_at
                      ? formatDate(project.deadline_at)
                      : "-"}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-sm text-gray-700 text-center capitalize">
                    {project.status}
                  </td>

                  {/* Primary Manager */}
                  <td className="py-4 px-6 text-sm text-gray-700 text-center">
                    {project.primaryManager
                      ? `${project.primaryManager.first_name} ${project.primaryManager.last_name}`
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 text-center capitalize">
                    {}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 text-center capitalize">
                    {}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 text-center capitalize">
                    {}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ProjectsPage;
