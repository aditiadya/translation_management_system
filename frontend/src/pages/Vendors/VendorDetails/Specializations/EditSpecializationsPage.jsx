import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const EditSpecializationsPage = ({ vendorId, onUpdateComplete }) => {
  const [specializations, setSpecializations] = useState([]);
  const [vendorSpecializations, setVendorSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all admin specializations
        const { data: allSpecsRes } = await api.get("/admin-specializations", {
          withCredentials: true,
        });

        // Fetch vendor specializations with mapping IDs
        const { data: vendorSpecsRes } = await api.get(
          `/vendor-specializations/${vendorId}/specializations`,
          { withCredentials: true }
        );

        const allSpecializations = allSpecsRes?.data || [];
        const vendorData = vendorSpecsRes?.data;

        let vendorSpecs = [];
        if (Array.isArray(vendorData?.specializations)) {
          vendorSpecs = vendorData.specializations;
        }

        console.log("All Specializations:", allSpecializations);
        console.log("Vendor Specializations:", vendorSpecs);

        setSpecializations(allSpecializations);
        setVendorSpecializations(vendorSpecs);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const isSpecializationSelected = (specId) =>
    vendorSpecializations.some((vs) => Number(vs.id) === Number(specId));

const handleCheckboxChange = async (specialization) => {
  try {
    setUpdating(true);
    const selected = isSpecializationSelected(specialization.id);

    if (!selected) {
      // ADD specialization
      const res = await api.post(
        "/vendor-specializations",
        {
          vendor_id: vendorId,
          specialization_id: specialization.id,
        },
        { withCredentials: true }
      );

      const addedSpec = res.data.data;
      setVendorSpecializations((prev) => [
        ...prev,
        {
          id: specialization.id,
          name: specialization.name,
          mapping_id: addedSpec.id,
          price_count: 0,
        },
      ]);
    } else {
      // REMOVE specialization
      const vendorSpec = vendorSpecializations.find(
        (vs) => Number(vs.id) === Number(specialization.id)
      );

      if (vendorSpec) {
        const priceCount = vendorSpec.price_count || 0;
        
        // Show confirmation if there are prices
        if (priceCount > 0) {
          const confirmed = window.confirm(
            `This will delete ${priceCount} price(s) associated with "${specialization.name}". Continue?`
          );
          
          if (!confirmed) {
            setUpdating(false);
            return;
          }
        }

        if (vendorSpec.mapping_id) {
          await api.delete(`/vendor-specializations/${vendorSpec.mapping_id}`, {
            withCredentials: true,
          });

          setVendorSpecializations((prev) =>
            prev.filter((vs) => Number(vs.id) !== Number(specialization.id))
          );
        }
      }
    }
  } catch (error) {
    console.error("Error updating vendor specialization:", error);
    alert(error.response?.data?.message || "Failed to update specialization");
  } finally {
    setUpdating(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading specializations...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white rounded-2xl p-3 transition-all">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Manage Vendor Specializations
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Select
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Specialization Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {specializations.map((spec) => {
              const selected = isSpecializationSelected(spec.id);
              return (
                <tr
                  key={spec.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={updating}
                      onChange={() => handleCheckboxChange(spec)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {spec.name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-5">
        <button
          onClick={() => {
            if (typeof onUpdateComplete === "function") onUpdateComplete();
          }}
          disabled={updating}
          className={`px-8 py-3 rounded-xl text-white text-lg font-medium shadow-md transition-all duration-200 ${
            updating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {updating ? "Updating..." : "Done"}
        </button>
      </div>
    </div>
  );
};

export default EditSpecializationsPage;
