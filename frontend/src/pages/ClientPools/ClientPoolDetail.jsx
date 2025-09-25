import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";

const ClientPoolDetailsPage = () => {
  const { id } = useParams();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchPoolDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/client-pools/${id}`);
      setPool(res.data.data);
    } catch (err) {
      console.error("Failed to fetch pool details:", err);
      setError("Failed to fetch pool details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {/* Pool Name & Description */}
        <h1 className="text-3xl font-bold mb-2">{pool.name}</h1>
        <p className="text-gray-700 mb-6">{pool.description || "No description"}</p>

        {/* Clients */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Clients</h2>
          <ul className="list-disc pl-5 text-gray-800">
            {pool.clients?.length > 0 ? (
              pool.clients.map(client => (
                <li key={client.id}>{client.company_name}</li>
              ))
            ) : (
              <li className="text-gray-500">No clients</li>
            )}
          </ul>
        </div>

        {/* Managers */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Managers</h2>
          <ul className="list-disc pl-5 text-gray-800">
            {pool.managers?.length > 0 ? (
              pool.managers.map(manager => (
                <li key={manager.id}>{manager.first_name} {manager.last_name}</li>
              ))
            ) : (
              <li className="text-gray-500">No managers</li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
};

export default ClientPoolDetailsPage;
