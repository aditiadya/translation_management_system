import { Pencil, Trash2 } from "lucide-react";

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
    <div className="overflow-x-auto shadow rounded-lg bg-white">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-white text-black uppercase text-sm">
            <th className="py-3 px-6 text-center">Contact Name</th>
            <th className="py-3 px-6 text-center">Gender</th>
            <th className="py-3 px-6 text-center">Email</th>
            <th className="py-3 px-6 text-center">Phone</th>
            <th className="py-3 px-6 text-center">Teams ID</th>
            <th className="py-3 px-6 text-center">Position</th>
            <th className="py-3 px-6 text-center">Active</th>
            <th className="py-3 px-6 text-center">Invoicing</th>
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
              <td className="py-4 px-6 text-sm text-center text-gray-900 whitespace-nowrap">
                {`${contact.first_name} ${contact.last_name}`}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center capitalize">
                {contact.gender}
              </td>
              <td className="py-4 px-6 text-sm text-center">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 underline hover:text-indigo-600"
                >
                  {contact.email}
                </a>
              </td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">
                {contact.phone}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">
                {contact.teams_id || "-"}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">
                {contact.position || "-"}
              </td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">
                <Badge active={contact.is_active} />
              </td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">
                <Badge active={contact.is_invoicing} />
              </td>
              <td className="py-3 px-4 space-x-5 text-sm flex items-center">
                <button onClick={() => onEdit(contact)}>
                  <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />
                </button>

                <button onClick={() => onDelete(contact.id)}>
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer" />
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