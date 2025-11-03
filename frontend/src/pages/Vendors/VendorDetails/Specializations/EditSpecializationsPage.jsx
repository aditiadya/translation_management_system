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

        const { data: specializationsRes } = await api.get(
          "/admin-specializations",
          { withCredentials: true }
        );

        const { data: vendorSpecsRes } = await api.get(
          `/vendor-specializations/${vendorId}/specializations`,
          { withCredentials: true }
        );

        const allSpecializations = specializationsRes?.data || [];

        let vendorSpecsArray = [];
        const vendorData = vendorSpecsRes?.data?.data;

        if (Array.isArray(vendorData)) {
          vendorSpecsArray = vendorData;
        } else if (Array.isArray(vendorData?.specializations)) {
          vendorSpecsArray = vendorData.specializations;
        }

        const normalizedVendorSpecs = vendorSpecsArray.map((vs) => ({
          id: vs.id,
          specialization_id: Number(
            vs.specialization_id ||
              vs.specialization?.id ||
              vs.specializationId
          ),
          specialization_name:
            vs.specialization?.name ||
            vs.name ||
            vs.specialization_name ||
            "",
        }));

        console.log("Normalized Vendor Specializations:", normalizedVendorSpecs);
        console.log("Admin Specializations:", allSpecializations);

        setSpecializations(allSpecializations);
        setVendorSpecializations(normalizedVendorSpecs);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const isSpecializationSelected = (specId) =>
    vendorSpecializations.some((vs) => Number(vs.specialization_id) === Number(specId));

  const handleCheckboxChange = async (specialization) => {
    try {
      setUpdating(true);
      const selected = isSpecializationSelected(specialization.id);

      if (!selected) {
        const alreadyExists = vendorSpecializations.some(
          (vs) => Number(vs.specialization_id) === Number(specialization.id)
        );
        if (alreadyExists) return;

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
            id: addedSpec.id,
            specialization_id: addedSpec.specialization_id,
            specialization_name: specialization.name,
          },
        ]);
      } else {
        const vendorSpec = vendorSpecializations.find(
          (vs) => Number(vs.specialization_id) === Number(specialization.id)
        );

        if (vendorSpec) {
          await api.delete(`/vendor-specializations/${vendorSpec.id}`, {
            withCredentials: true,
          });

          setVendorSpecializations((prev) =>
            prev.filter(
              (vs) => Number(vs.specialization_id) !== Number(specialization.id)
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating vendor specialization:", error);
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
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
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
            alert("Specializations updated successfully!");
            if (typeof onUpdateComplete === "function") onUpdateComplete();
          }}
          disabled={updating}
          className={`px-8 py-3 rounded-xl text-white text-lg font-medium shadow-md transition-all duration-200 ${
            updating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {updating ? "Updating..." : "Update Specializations"}
        </button>
      </div>
    </div>
  );
};

export default EditSpecializationsPage;