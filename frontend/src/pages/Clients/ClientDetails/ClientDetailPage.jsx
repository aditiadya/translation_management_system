import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import ClientView from "./GeneralInfo/ClientView";
import GeneralInfoEditForm from "./GeneralInfo/GeneralInfoEditForm";
import PrimaryUserEditForm from "./GeneralInfo/PrimaryUserEditForm";
import SettingsEditForm from "./GeneralInfo/SettingsEditForm";
import ContactPersonsPage from "./ContactPersons/ContactPersonsPage";
import DocumentsPage from "./ClientDocuments/DocumentsPage";
import PriceListPage from "./PriceList/PriceListPage";

const tabs = [
  "General Info",
  "Contact Persons",
  "CRM",
  "Price List",
  "Taxes",
  "Documents",
];

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

        {activeTab === "Contact Persons" && <ContactPersonsPage clientId={id} />}

        {/* {activeTab === "CRM" && <CRMPage clientId={id} />} */}

        {activeTab === "Price List" && <PriceListPage clientId={id} />}

        {/* {activeTab === "Taxes" && <TaxesPage clientId={id} />} */}

        {activeTab === "Documents" && <DocumentsPage clientId={id} />}
    </>
  );
};

export default ClientDetailPage;