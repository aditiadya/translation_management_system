import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

const ManagersPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await api.get("/managers", { withCredentials: true });
        setManagers(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch managers");
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="flex justify-between items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Managers</h2>
          <button
            onClick={() => navigate("/managers/create-manager")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            + New Manager
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
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Client Pool</th>
                  <th className="py-3 px-6 text-left">Gender</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Teams ID</th>
                  <th className="py-3 px-6 text-left">Zoom ID</th>
                  <th className="py-3 px-6 text-left">Phone</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Last Login</th>
                </tr>
              </thead>

              <tbody>
                {managers.map((manager, index) => (
                  <tr
                    key={manager.id}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "hover:bg-gray-100"
                    }
                  >
                    <td className="py-4 px-6 text-sm text-blue-600 underline hover:text-indigo-600 whitespace-nowrap">
                      <Link to={`/managers/${manager.id}`}>
                        {manager.first_name} {manager.last_name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.role.role_details?.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.client_pool?.name || "-"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 capitalize">
                      {manager.gender}
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600">
                      <a
                        href={`mailto:${manager.auth.email}`}
                        className="underline hover:text-indigo-600"
                      >
                        {manager.auth.email}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.teams_id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.zoom_id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{manager.phone}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 inline-block text-sm rounded-full ${
                          manager.can_login
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {manager.can_login ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
};

export default ManagersPage;