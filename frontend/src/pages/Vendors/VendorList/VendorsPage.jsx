import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axiosInstance";

const VendorsPage = () => {
  const navigate = useNavigate();
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
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="ttext-2xl font-bold text-gray-900">Vendors</h1>
          <div>
            <button
              onClick={() => navigate("/vendors/create-vendor")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
            >
              New Vendor
            </button>

            <button
              onClick={() => navigate("/vendors")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 ml-4 rounded shadow"
            >
              Import from Excel
            </button>

            <button
              onClick={() => navigate("/vendors")}
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
                  <th className="py-3 px-6 text-center">Name</th>
                  <th className="py-3 px-6 text-center">Type</th>
                  <th className="py-3 px-6 text-center">Services</th>
                  <th className="py-3 px-6 text-center">Language Pairs</th>
                  <th className="py-3 px-6 text-center">Specializations</th>
                  <th className="py-3 px-6 text-center">Primary User</th>
                  <th className="py-3 px-6 text-center">Country</th>
                  <th className="py-3 px-6 text-center">Assignable</th>
                  <th className="py-3 px-6 text-center">Tags</th>
                  <th className="py-3 px-6 text-center">Created At</th>
                  <th className="py-3 px-6 text-center">Invited At</th>
                  <th className="py-3 px-6 text-center">Registered At</th>
                  <th className="py-3 px-6 text-center">Last Activity At</th>
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
                      <td className="py-4 px-6 text-sm text-gray-700 text-center">
                        {vendor.company_name || "—"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 text-center">
                        {vendor.type || "—"}
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="py-4 px-6 text-sm text-blue-600 underline hover:text-indigo-600 whitespace-nowrap text-center">
                        <Link to={`/vendors/${vendor.id}`}>
                          {primaryUser.first_name || ""}{" "}
                          {primaryUser.last_name || ""}
                        </Link>
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-700 text-center">
                        {vendor.country || "—"}
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-700 text-center">
                        {vendor.assignable_to_jobs ? "Yes" : "No"}
                      </td>
                      <td></td>
                      <td className="py-4 px-6 text-sm text-gray-500 text-center">
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
    </>
  );
};

export default VendorsPage;