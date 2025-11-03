import React, { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";

const EditServicePage = ({ vendorId, onUpdateComplete }) => {
  const [services, setServices] = useState([]);
  const [vendorServices, setVendorServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: servicesRes } = await api.get("/admin-services", {
          withCredentials: true,
        });

        const { data: vendorServicesRes } = await api.get(
          `/vendor-services/${vendorId}/services`,
          {
            withCredentials: true,
          }
        );

        const allServices = servicesRes?.data || [];

        let vendorServicesArray = [];
        const vendorData = vendorServicesRes?.data?.data;

        if (Array.isArray(vendorData)) {
          vendorServicesArray = vendorData;
        } else if (Array.isArray(vendorData?.services)) {
          vendorServicesArray = vendorData.services;
        }

        const normalizedVendorServices = vendorServicesArray.map((vs) => ({
          id: vs.id,
          service_id: Number(vs.service_id || vs.service?.id || vs.serviceId),
          service_name: vs.service?.name || vs.name || vs.service_name || "",
        }));

        console.log("Normalized Vendor Services:", normalizedVendorServices);
        console.log("Admin Services:", allServices);

        setServices(allServices);
        setVendorServices(normalizedVendorServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const isServiceSelected = (serviceId) =>
    vendorServices.some((vs) => Number(vs.service_id) === Number(serviceId));

  const handleCheckboxChange = async (service) => {
    try {
      setUpdating(true);
      const selected = isServiceSelected(service.id);

      if (!selected) {
        const alreadyExists = vendorServices.some(
          (vs) => Number(vs.service_id) === Number(service.id)
        );
        if (alreadyExists) return;
        const res = await api.post(
          "/vendor-services",
          {
            vendor_id: vendorId,
            service_id: service.id,
          },
          {
            withCredentials: true,
          }
        );

        const addedService = res.data.data;
        setVendorServices((prev) => [
          ...prev,
          {
            id: addedService.id,
            service_id: addedService.service_id,
            service_name: service.name,
          },
        ]);
      } else {
        const vendorService = vendorServices.find(
          (vs) => Number(vs.service_id) === Number(service.id)
        );

        if (vendorService) {
          await api.delete(`/vendor-services/${vendorService.id}`, {
            withCredentials: true,
          });

          setVendorServices((prev) =>
            prev.filter((vs) => Number(vs.service_id) !== Number(service.id))
          );
        }
      }
    } catch (error) {
      console.error("Error updating vendor service:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading services...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white rounded-2xl p-3 transition-all">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Manage Vendor Services
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Select
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Service Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {services.map((service) => {
              const selected = isServiceSelected(service.id);
              return (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={updating}
                      onChange={() => handleCheckboxChange(service)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {service.name}
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
            alert("Services updated successfully!");
            if (typeof onUpdateComplete === "function") onUpdateComplete();
          }}
          disabled={updating}
          className={`px-8 py-3 rounded-xl text-white text-lg font-medium shadow-md transition-all duration-200 ${
            updating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {updating ? "Updating..." : "Update Services"}
        </button>
      </div>
    </div>
  );
};

export default EditServicePage;