import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";
import ServiceList from "./ServiceList";
import ServiceForm from "./ServiceForm";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const ServicesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        const res = await api.put(`/admin-services/${activeService.id}`, formData);
        setServices(services.map((s) => (s.id === activeService.id ? res.data.data : s)));
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
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Services</h1>
          {!isFormVisible && (
            <button
              onClick={handleAddNewClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
            >
              + New Service
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
      </main>

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