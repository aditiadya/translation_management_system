import { FaEdit, FaTrash } from "react-icons/fa";

const ContactPersonsTable = ({ persons = [], onEdit, onDelete }) => {
  if (!persons || persons.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        No contact persons found.
      </p>
    );
  }

  const Badge = ({ active }) => (
    <span
      className={`px-3 py-1 inline-block text-sm rounded-full font-medium ${
        active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
      }`}
    >
      {active ? "Yes" : "No"}
    </span>
  );

  return (
    <div className="overflow-x-auto shadow rounded-lg bg-white pt-3">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-white text-black uppercase text-sm">
            <th className="py-3 px-6 text-left">Contact Name</th>
            <th className="py-3 px-6 text-left">Gender</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Teams ID</th>
            <th className="py-3 px-6 text-left">Position</th>
            <th className="py-3 px-6 text-left">Active</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {persons.map((contact, index) => (
            <tr
              key={contact.id}
              className={
                index % 2 === 0
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "hover:bg-gray-100"
              }
            >
              <td className="py-4 px-6 text-gray-900 whitespace-nowrap">
                {`${contact.first_name} ${contact.last_name}`}
              </td>
              <td className="py-4 px-6 text-gray-700 capitalize">
                {contact.gender}
              </td>
              <td className="py-4 px-6">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 underline hover:text-indigo-600"
                >
                  {contact.email}
                </a>
              </td>
              <td className="py-4 px-6 text-gray-700">{contact.phone}</td>
              <td className="py-4 px-6 text-gray-700">
                {contact.teams_id || "-"}
              </td>
              <td className="py-4 px-6 text-gray-700">
                {contact.position || "-"}
              </td>
              <td className="py-4 px-6">
                <Badge active={contact.is_active} />
              </td>
              <td className="py-4 px-6 text-center whitespace-nowrap">
                <button
                  onClick={() => onEdit(contact)}
                  className="text-blue-600 hover:text-indigo-700 mx-2 transition"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(contact.id)}
                  className="text-red-600 hover:text-red-700 mx-2 transition"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactPersonsTable;