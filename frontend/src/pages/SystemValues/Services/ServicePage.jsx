import { useEffect, useState } from "react";
import api from "../../../utils/axiosInstance";
import ServiceList from "./ServiceList";
import ServiceForm from "./ServiceForm";
import ConfirmModal from "../../../components/Modals/ConfirmModal";
import BackButton from "../../../components/Button/BackButton";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeService, setActiveService] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/admin-services");
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (activeService === "new") {
        const res = await api.post("/admin-services", formData);
        setServices([...services, res.data.data]);
      } else {
        const res = await api.put(
          `/admin-services/${activeService.id}`,
          formData
        );
        setServices(
          services.map((s) => (s.id === activeService.id ? res.data.data : s))
        );
      }
      setIsFormVisible(false);
      setActiveService(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save service");
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    try {
      await api.delete(`/admin-services/${serviceToDelete}`);
      setServices(services.filter((s) => s.id !== serviceToDelete));
      setServiceToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  const handleAddNewClick = () => {
    setActiveService("new");
    setIsFormVisible(true);
  };

  const handleEditClick = (service) => {
    setActiveService(service);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setActiveService(null);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <>
        <div className="flex justify-between items-center gap-3 mb-8">
          <div className="flex items-center gap-3">
            <BackButton to="/system-values" />
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          </div>
          {!isFormVisible && (
            <button
              onClick={handleAddNewClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
            >
              Add Service
            </button>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {isFormVisible ? (
          <ServiceForm
            serviceToEdit={activeService === "new" ? null : activeService}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        ) : (
          <ServiceList
            services={services}
            onEdit={handleEditClick}
            onDelete={(id) => setServiceToDelete(id)}
          />
        )}

      {serviceToDelete && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this service? This action cannot be undone."
          onCancel={() => setServiceToDelete(null)}
          onConfirm={handleDelete}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </>
  );
};

export default ServicesPage;