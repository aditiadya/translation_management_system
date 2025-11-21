import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/axiosInstance";

const ClientPoolsPage = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPools = async () => {
    try {
      setLoading(true);
      const res = await api.get("/client-pools");
      setPools(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch client pools:", error);
      setError("Failed to fetch client pools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return (
    <>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Client Pools</h1>
          <button
            onClick={() => navigate("/add-client-pool")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
          >
            Add Client Pool
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
                  <th className="py-3 px-6 text-left">Pool Name</th>
                  <th className="py-3 px-6 text-left">Number of Clients</th>
                  <th className="py-3 px-6 text-left">Number of Managers</th>
                  <th className="py-3 px-6 text-left">Description</th>
                </tr>
              </thead>

              <tbody>
                {pools.map((pool, index) => (
                  <tr
                    key={pool.id}
                    className={
                      index % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "hover:bg-gray-100"
                    }
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">
                      <Link
                        to={`/client-pools/${pool.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {pool.name}
                      </Link>
                    </td>

                    <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                      {pool.clients?.length || 0}
                    </td>

                    <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                      {pool.managers?.length || 0}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {pool.description || "—"}
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

export default ClientPoolsPage;