import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axiosInstance";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/clients", { withCredentials: true });
        setClients(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div>
          <button
            onClick={() => navigate("/clients/create-client")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            Add Client
          </button>

          <button
            onClick={() => navigate("/clients")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
          >
            Import from Excel
          </button>

          <button
            onClick={() => navigate("/clients")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
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
        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-white text-black uppercase text-sm">
                <th className="py-3 px-6 text-center">Type</th>
                <th className="py-3 px-6 text-center">Company Name</th>
                <th className="py-3 px-6 text-center">Primary User</th>
                <th className="py-3 px-6 text-center">Country</th>
                <th className="py-3 px-6 text-center">Email</th>
                <th className="py-3 px-6 text-center">Assignable</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Created At</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client, index) => {
                const primaryUser = client.primary_user || {};
                return (
                  <tr
                    key={client.id}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "hover:bg-gray-100"
                    }
                  >
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {client.type || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {client.company_name || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600 text-center underline hover:text-indigo-600 whitespace-nowrap">
                      <Link to={`/clients/${client.id}`}>
                        {primaryUser.first_name || ""}{" "}
                        {primaryUser.last_name || ""}
                      </Link>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {client.country || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600 text-center">
                      <a
                        href={`mailto:${client.auth?.email}`}
                        className="underline hover:text-indigo-600"
                      >
                        {client.auth?.email || "—"}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 text-center">
                      {client.assignable ? "Yes" : "No"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 inline-block text-sm text-center rounded-full ${
                          client.can_login
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {client.can_login ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-center text-gray-500">
                      {client.createdAt
                        ? new Date(client.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ClientsPage;