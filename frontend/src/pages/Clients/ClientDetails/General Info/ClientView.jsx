import { useState } from "react";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";

const ClientView = ({
  client,
  onEditGeneral,
  onEditPrimary,
  onEditSettings,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    onDelete();
  };

  const primaryUser = client.primary_users || {};

  return (
    <div className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">General Info</h3>

          <div className="space-x-3 flex">
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
              New Quote
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
              New Project
            </button>
            {/* Quick links dropdown (placeholder) */}
            <div className="relative">
              <button className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700">
                Quick Links ▾
              </button>
              {/* Add dropdown menu here if needed */}
            </div>
            <button
              onClick={onEditGeneral}
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

        <div className="bg-white shadow rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Field label="Name" value={client.company_name} />
            <Field label="Type" value={client.type} />
            <Field label="Legal Entity" value={client.legal_entity} />
            <Field label="Status" value={client.status} />
            <Field label="PAN / Tax Number" value={client.pan_tax_number} />
            <Field label="GSTIN / VAT Number" value={client.gstin_vat_number} />
            <Field
              label="Website"
              value={
                client.website ? (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {client.website}
                  </a>
                ) : (
                  "—"
                )
              }
            />
          </div>
          <div className="space-y-4">
            <Field label="Country" value={client.country} />
            <Field label="State / Region" value={client.state_region} />
            <Field label="City" value={client.city} />
            <Field label="Address" value={client.address} />
            <Field label="Postal Code" value={client.postal_code} />
            
            <Field label="Note" value={client.note} />
          </div>
        </div>
      </section>

      {/* ---------- Primary User Details ---------- */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Primary User Details
          </h3>
          <button
            onClick={onEditPrimary}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            Update
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Field
              label="Name"
              value={`${primaryUser.first_name || ""} ${
                primaryUser.last_name || ""
              }`}
            />
            <Field label="Email" value={client.auth?.email} />
            <Field label="Timezone" value={primaryUser.timezone} />
            <Field label="Phone" value={primaryUser.phone} />
            <Field label="Zoom ID" value={primaryUser.zoom_id} />
            <Field label="Teams ID" value={primaryUser.teams_id} />
          </div>
          <div className="space-y-4">
            
            <Field label="Gender" value={primaryUser.gender} />
            <Field label="Nationality" value={primaryUser.nationality} />
            <Field
              label="Can Login"
              value={
                client.can_login ? (
                  <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                    Enabled
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-600">
                    Disabled
                  </span>
                )
              }
            />
            <Field
              label="Invited At"
              value={
                client.invitedAt
                  ? new Date(client.invitedAt).toLocaleString()
                  : "—"
              }
            />
            <Field
              label="Last Activity At"
              value={
                client.lastActivityAt
                  ? new Date(client.lastActivityAt).toLocaleString()
                  : "—"
              }
            />
          </div>
        </div>
      </section>

      {/* ---------- Settings ---------- */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
          <button
            onClick={onEditSettings}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            Update
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Field label="Client Manager" value="—" />
            <Field label="Default Legal Entity" value="—" />
            <Field label="Default Currency" value="—" />
            <Field label="Default Payment Method" value="—" />
          </div>
          <div className="space-y-4">
            <Field label="Default Payment Terms" value="—" />
            <Field label="Default CAT Log Conversion Scheme" value="—" />
            <Field label="Default Invoice PDF Template" value="—" />
          </div>
        </div>
      </section>

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

const Field = ({ label, value }) => (
  <div className="flex">
    <span className="w-44 font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value || "—"}</span>
  </div>
);

export default ClientView;