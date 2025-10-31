import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
          <div>
            <button
              onClick={() => navigate("/clients/create-client")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
            >
              New Client
            </button>

            <button
              onClick={() => navigate("/clients")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
            >
              Import from Excel
            </button>

            <button
              onClick={() => navigate("/clients")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
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
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Company Name</th>
                  <th className="py-3 px-6 text-left">Primary User</th>
                  <th className="py-3 px-6 text-left">Country</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Assignable</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client, index) => {
                  const primaryUser = client.primary_users || {};
                  return (
                    <tr
                      key={client.id}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "hover:bg-gray-100"
                      }
                    >
                      <td className="py-4 px-6 text-gray-700">
                        {client.type || "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {client.company_name || "—"}
                      </td>
                      <td className="py-4 px-6 text-blue-600 underline hover:text-indigo-600 whitespace-nowrap">
                        <Link to={`/clients/${client.id}`}>
                          {primaryUser.first_name || ""}{" "}
                          {primaryUser.last_name || ""}
                        </Link>
                      </td>

                      <td className="py-4 px-6 text-gray-700">
                        {client.country || "—"}
                      </td>
                      <td className="py-4 px-6 text-blue-600">
                        <a
                          href={`mailto:${client.auth?.email}`}
                          className="underline hover:text-indigo-600"
                        >
                          {client.auth?.email || "—"}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {client.assignable ? "Yes" : "No"}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
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
      </main>
    </>
  );
};

export default ClientsPage;