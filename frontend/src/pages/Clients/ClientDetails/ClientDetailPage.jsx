import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";
import ClientView from "./ClientView";
import ClientEditForm from "./ClientEditForm";
import GeneralInfoEditForm from "./GeneralInfoEditForm";
import PrimaryUserEditForm from "./PrimaryUserEditForm";
import SettingsEditForm from "./SettingsEditForm";

const tabs = [
  "General Info",
  "Contact Persons",
  "Client Pools",
  "CRM",
  "Price List",
  "Taxes",
  "Documents",
  "Project Charts",
];

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [activeTab, setActiveTab] = useState("General Info");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${id}`, {
          withCredentials: true,
        });
        setClient(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch client details");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleSave = async (updatedData) => {
  try {
    const response = await api.put(`/clients/${id}`, updatedData, {
      withCredentials: true,
    });
    setClient(response.data.data);
    setEditingSection(null);
  } catch (err) {
    console.error("Update failed", err);
    alert("Failed to update client");
  }
};


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await api.delete(`/clients/${id}`, { withCredentials: true });
      alert("Client deleted successfully");
      navigate("/clients");
    } catch (err) {
      console.error(err);
      alert("Failed to delete client");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {/* Tabs */}
        <div className="border-b mb-6 flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`pb-2 font-medium text-gray-600 border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-900 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "General Info" && (
  <>
    {!editingSection ? (
      <ClientView
        client={client}
        onEditGeneral={() => setEditingSection("general")}
        onEditPrimary={() => setEditingSection("primary")}
        onEditSettings={() => setEditingSection("settings")}
        onDelete={handleDelete}
      />
    ) : editingSection === "general" ? (
      <GeneralInfoEditForm
        client={client}
        onSave={handleSave}
        onCancel={() => setEditingSection(null)}
      />
    ) : editingSection === "primary" ? (
      <PrimaryUserEditForm
        client={client}
        onSave={handleSave}
        onCancel={() => setEditingSection(null)}
      />
    ) : editingSection === "settings" ? (
      <SettingsEditForm
        client={client}
        onSave={(updated) => {
          console.log("Save settings info", updated);
          setEditingSection(null);
        }}
        onCancel={() => setEditingSection(null)}
      />
    ) : null}
  </>
)}

        {activeTab === "Contact Persons" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Contact Persons</h2>
            {/* Placeholder – you’ll define this later */}
            <p className="text-gray-500">
              Contact person details will go here.
            </p>
          </div>
        )}

        {activeTab === "Client Pools" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Client Pools</h2>
            <p className="text-gray-500">Client pool details will go here.</p>
          </div>
        )}

        {activeTab === "CRM" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">CRM</h2>
            <p className="text-gray-500">
              CRM integration details will go here.
            </p>
          </div>
        )}

        {activeTab === "Price List" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Price List</h2>
            <p className="text-gray-500">Price list details will go here.</p>
          </div>
        )}

        {activeTab === "Taxes" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Taxes</h2>
            <p className="text-gray-500">Tax details will go here.</p>
          </div>
        )}

        {activeTab === "Documents" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <p className="text-gray-500">Client documents will go here.</p>
          </div>
        )}

        {activeTab === "Project Charts" && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Project Charts</h2>
            <p className="text-gray-500">Charts and reports will go here.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ClientDetailPage;
