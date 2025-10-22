import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import ContactPersonsTable from "./ContactPersonsTable";
import AddContactPersonForm from "./AddContactPersonForm";
import EditContactPersonForm from "./EditContactPersonForm";

const ContactPersonsPage = ({ clientId }) => {
  const [contactPersons, setContactPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editPerson, setEditPerson] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/client/contact-persons`, {
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
  }, [clientId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact person?"))
      return;
    try {
      await api.delete(`client/contact-persons/${id}`, { withCredentials: true });
      fetchContacts();
    } catch (err) {
      alert("Failed to delete contact person");
    }
  };

  const handleAdd = async (data) => {
    try {
      await api.post("client/contact-persons", { ...data, client_id: clientId });
      setIsAddOpen(false);
      fetchContacts();
    } catch (err) {
      alert("Failed to add contact person");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`client/contact-persons/${id}`, data, { withCredentials: true });
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
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-700">
          Contact Persons
        </h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Contact Person
        </button>
      </div>

      <ContactPersonsTable
        persons={contactPersons}
        onEdit={setEditPerson}
        onDelete={handleDelete}
      />

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
