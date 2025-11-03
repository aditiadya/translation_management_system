import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import api from "../../../utils/axiosInstance";
import VendorView from "./GeneralInfo/VendorView";
import GeneralInfoEditForm from "./GeneralInfo/GeneralInfoEditForm";
import PrimaryUserEditForm from "./GeneralInfo/PrimaryUserEditForm";
import SettingsEditForm from "./GeneralInfo/SettingsEditForm";
import ContactPersonsPage from "./ContactPersons/ContactPersonPage";
import DocumentsPage from "./VendorDocuments/DocumentsPage";
import VendorServicesPage from "./Services/VendorServicesPage";
import VendorLanguagePairsPage from "./LanguagePairs/VendorLanguagePairsPage"
import VendorSpecializationsPage from "./Specializations/VendorSpecializationsPage";

const tabs = [
  "General Info",
  "Contact Persons",
  "Payment Methods",
  "Services",
  "Language Pairs",
  "Specializations",
  "Price List",
  "Taxes",
  "Documents",
  "Availability Charts",
];

const VendorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [activeTab, setActiveTab] = useState("General Info");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await api.get(`/vendors/${id}`, {
          withCredentials: true,
        });
        setVendor(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vendor details");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  const handleSave = async (updatedData) => {
    try {
      const response = await api.put(`/vendors/${id}`, updatedData, {
        withCredentials: true,
      });
      setVendor(response.data.data);
      setEditingSection(null);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update vendor");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await api.delete(`/vendors/${id}`, { withCredentials: true });
      alert("Vendor deleted successfully");
      navigate("/vendors");
    } catch (err) {
      console.error(err);
      alert("Failed to delete vendor");
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
              <VendorView
                vendor={vendor}
                onEditGeneral={() => setEditingSection("general")}
                onEditPrimary={() => setEditingSection("primary")}
                onEditSettings={() => setEditingSection("settings")}
                onDelete={handleDelete}
              />
            ) : editingSection === "general" ? (
              <GeneralInfoEditForm
                vendor={vendor}
                onSave={handleSave}
                onCancel={() => setEditingSection(null)}
              />
            ) : editingSection === "primary" ? (
              <PrimaryUserEditForm
                vendor={vendor}
                onSave={handleSave}
                onCancel={() => setEditingSection(null)}
              />
            ) : editingSection === "settings" ? (
              <SettingsEditForm
                vendor={vendor}
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
          <ContactPersonsPage vendorId={id} />
        )}

        {/* {activeTab === "Payment Methods" && (
          <PaymentMethodsPage vendorId={id} />
        )} */}

        {activeTab === "Services" && (
          <VendorServicesPage vendorId={id} />
        )}

        {activeTab === "Language Pairs" && (
          <VendorLanguagePairsPage vendorId={id} />
        )}

        {activeTab === "Specializations" && (
          <VendorSpecializationsPage vendorId={id} />
        )}

         {/* 

        {activeTab === "Price List" && (
          <PriceListPage vendorId={id} />
        )}

        {activeTab === "Taxes" && (
          <TaxesPage vendorId={id} />
        )} */}

        {activeTab === "Documents" && (
          <DocumentsPage vendorId={id} />
        )}

        {/* {activeTab === "Availability Charts" && (
          <AvailabilityChartsPage vendorId={id} />
        )} */}

      </main>
    </>
  );
};

export default VendorDetailPage;