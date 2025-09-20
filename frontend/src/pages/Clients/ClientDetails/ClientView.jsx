import { useState } from "react";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const ClientView = ({ client, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    onDelete();
  };

  const primaryUser = client.primary_users || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">General Info</h3>

        <div className="space-x-4">
          <button
            onClick={onEdit}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            Update
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client fields */}
          <div className="space-y-4">
            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Type:</span>
              <span className="text-gray-900">{client.type}</span>
            </div>

            {client.type === "Company" && (
              <div className="flex">
                <span className="w-44 font-medium text-gray-700">
                  Company Name:
                </span>
                <span className="text-gray-900">{client.company_name}</span>
              </div>
            )}

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">
                Legal Entity:
              </span>
              <span className="text-gray-900">{client.legal_entity}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Status:</span>
              <span className="text-gray-900">{client.status}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Country:</span>
              <span className="text-gray-900">{client.country}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">
                State / Region:
              </span>
              <span className="text-gray-900">{client.state_region}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">City:</span>
              <span className="text-gray-900">{client.city}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Postal Code:</span>
              <span className="text-gray-900">{client.postal_code}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Address:</span>
              <span className="text-gray-900">{client.address}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">
                PAN / Tax Number:
              </span>
              <span className="text-gray-900">{client.pan_tax_number}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">
                GSTIN / VAT Number:
              </span>
              <span className="text-gray-900">{client.gstin_vat_number}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Website:</span>
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {client.website}
              </a>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Note:</span>
              <span className="text-gray-900">{client.note}</span>
            </div>
          </div>

          {/* Primary user + additional fields */}
          <div className="space-y-4">
            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Primary User:</span>
              <span className="text-gray-900">
                {primaryUser.first_name} {primaryUser.last_name}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Timezone:</span>
              <span className="text-gray-900">{primaryUser.timezone}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{primaryUser.phone}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Zoom ID:</span>
              <span className="text-gray-900">{primaryUser.zoom_id}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Teams ID:</span>
              <span className="text-gray-900">{primaryUser.teams_id}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Gender:</span>
              <span className="text-gray-900">{primaryUser.gender}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Nationality:</span>
              <span className="text-gray-900">{primaryUser.nationality}</span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Can Login:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  client.can_login
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {client.can_login ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 font-medium text-gray-700">Created At:</span>
              <span className="text-gray-900">
                {client.createdAt
                  ? new Date(client.createdAt).toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this client?"
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          confirmText="Yes, Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default ClientView;
