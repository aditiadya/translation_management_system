import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";

const VendorsPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/vendors", { withCredentials: true });
        setVendors(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
          <h1 className="text-3xl font-bold text-gray-800">Vendors</h1>
          <div>
            <button
              onClick={() => navigate("/vendors/create-vendor")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
            >
              New Vendor
            </button>

            <button
              onClick={() => navigate("/vendors")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
            >
              Import from Excel
            </button>

            <button
              onClick={() => navigate("/vendors")}
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
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Services</th>
                  <th className="py-3 px-6 text-left">Language Pairs</th>
                  <th className="py-3 px-6 text-left">Specializations</th>
                  <th className="py-3 px-6 text-left">Primary User</th>
                  <th className="py-3 px-6 text-left">Country</th>
                  <th className="py-3 px-6 text-left">Assignable</th>
                  <th className="py-3 px-6 text-left">Tags</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-left">Invited At</th>
                  <th className="py-3 px-6 text-left">Registered At</th>
                  <th className="py-3 px-6 text-left">Last Activity At</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor, index) => {
                  const primaryUser = vendor.primary_users || {};
                  return (
                    <tr
                      key={vendor.id}
                      className={
                        index % 2 === 0
                          ? "bg-gray-50 hover:bg-gray-100"
                          : "hover:bg-gray-100"
                      }
                    >
                      <td className="py-4 px-6 text-gray-700">
                        {vendor.company_name || "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {vendor.type || "—"}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="py-4 px-6 text-blue-600 underline hover:text-indigo-600 whitespace-nowrap">
                        <Link to={`/vendors/${vendor.id}`}>
                          {primaryUser.first_name || ""}{" "}
                          {primaryUser.last_name || ""}
                        </Link>
                      </td>

                      <td className="py-4 px-6 text-gray-700">
                        {vendor.country || "—"}
                      </td>

                      <td className="py-4 px-6 text-gray-700">
                        {vendor.assignable_to_jobs ? "Yes" : "No"}
                      </td>
                      <td></td>
                      <td className="py-4 px-6 text-gray-500">
                        {vendor.createdAt
                          ? new Date(vendor.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
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

export default VendorsPage;