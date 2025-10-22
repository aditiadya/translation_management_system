import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import ContactPersonsTable from "./ContactPersonsTable";
import AddContactPersonForm from "./AddContactPersonForm";
import EditContactPersonForm from "./EditContactPersonForm";

const ContactPersonsPage = ({ vendorId }) => {
  const [contactPersons, setContactPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editPerson, setEditPerson] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`vendor/contact-persons`, {
        withCredentials: true,
      });
      setContactPersons(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch contact persons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [vendorId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact person?")) return;
    try {
      await api.delete(`vendor/contact-persons/${id}`, { withCredentials: true });
      fetchContacts();
    } catch (err) {
      alert("Failed to delete contact person");
    }
  };

  const handleAdd = async (data) => {
    try {
      await api.post("vendor/contact-persons", { ...data, vendor_id: vendorId });
      setIsAddOpen(false);
      fetchContacts();
    } catch (err) {
      alert("Failed to add contact person");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`vendor/contact-persons/${id}`, data, { withCredentials: true });
      setEditPerson(null);
      fetchContacts();
    } catch (err) {
      alert("Failed to update contact person");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Contact Persons</h3>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            Add Contact Person
          </button>
        </div>

          <ContactPersonsTable
            persons={contactPersons}
            onEdit={setEditPerson}
            onDelete={handleDelete}
          />
        
      </section>

      {isAddOpen && (
        <AddContactPersonForm
          onClose={() => setIsAddOpen(false)}
          onSave={handleAdd}
        />
      )}

      {editPerson && (
        <EditContactPersonForm
          person={editPerson}
          onClose={() => setEditPerson(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default ContactPersonsPage;