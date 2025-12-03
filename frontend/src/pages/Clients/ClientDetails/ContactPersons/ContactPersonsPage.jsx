import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import ContactPersonsTable from "./ContactPersonsTable";
import AddContactPersonForm from "./AddContactPersonForm";
import EditContactPersonForm from "./EditContactPersonForm";
import BackButton from "../../../../components/Button/BackButton";

const ContactPersonsPage = ({ clientId }) => {
  const [contactPersons, setContactPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("list"); // list | add | edit
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
      await api.delete(`client/contact-persons/${id}`, {
        withCredentials: true,
      });
      fetchContacts();
    } catch (err) {
      alert("Failed to delete contact person");
    }
  };

  const handleAdd = async (data) => {
    try {
      await api.post("client/contact-persons", {
        ...data,
        client_id: clientId,
      });
      setView("list");
      fetchContacts();
    } catch (err) {
      alert("Failed to add contact person");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`client/contact-persons/${id}`, data, {
        withCredentials: true,
      });
      setView("list");
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
    <div className="space-y-5">
      {/* HEADER changes depending on view */}
      {view === "list" && (
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <BackButton to="/clients" />

            <h2 className="text-2xl font-bold text-gray-900">
              Contact Persons
            </h2>
          </div>

          <button
            onClick={() => setView("add")}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Add Contact Person
          </button>
        </div>
      )}

      {view === "list" && (
        <ContactPersonsTable
          persons={contactPersons}
          onEdit={(p) => {
            setEditPerson(p);
            setView("edit");
          }}
          onDelete={handleDelete}
        />
      )}

      {view === "add" && (
        <AddContactPersonForm
          onClose={() => setView("list")}
          onSave={handleAdd}
        />
      )}

      {view === "edit" && editPerson && (
        <EditContactPersonForm
          person={editPerson}
          onClose={() => {
            setEditPerson(null);
            setView("list");
          }}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default ContactPersonsPage;