import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axiosInstance";

const ManagersPage = () => {
  const navigate = useNavigate();
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
        <div className="flex justify-between items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Managers</h2>
          <button
            onClick={() => navigate("/managers/create-manager")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            Add Manager
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
                  <th className="py-3 px-6 text-center">Name</th>
                  <th className="py-3 px-6 text-center">Role</th>
                  <th className="py-3 px-6 text-center">Client Pool</th>
                  <th className="py-3 px-6 text-center">Gender</th>
                  <th className="py-3 px-6 text-center">Email</th>
                  <th className="py-3 px-6 text-center">Teams ID</th>
                  <th className="py-3 px-6 text-center">Zoom ID</th>
                  <th className="py-3 px-6 text-center">Phone</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Last Login</th>
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
                    <td className="py-4 px-6 text-sm text-blue-600 text-center underline hover:text-indigo-600 whitespace-nowrap">
                      <Link to={`/managers/${manager.id}`}>
                        {manager.first_name} {manager.last_name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {manager.role.role_details?.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {manager.client_pool?.name || "-"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center capitalize">
                      {manager.gender}
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600 text-center">
                      <a
                        href={`mailto:${manager.auth.email}`}
                        className="underline hover:text-indigo-600"
                      >
                        {manager.auth.email}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {manager.teams_id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {manager.zoom_id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">{manager.phone}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 inline-block text-sm text-center rounded-full ${
                          manager.can_login
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {manager.can_login ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  );
};

export default ManagersPage;