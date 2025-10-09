import { useState } from "react";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";

const VendorView = ({
  vendor,
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

  const primaryUser = vendor.primary_users || {};

  return (
    <div className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">General Info</h3>

          <div className="space-x-3 flex">
            {/* Quick links dropdown */}
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
            <Field label="Name" value={vendor.company_name} />
            <Field label="Type" value={vendor.type} />
            <Field label="Legal Entity" value={vendor.legal_entity} />
            <Field label="PAN / Tax Number" value={vendor.pan_tax_number} />
            <Field label="GSTIN / VAT Number" value={vendor.gstin_vat_number} />
            <Field
              label="Website"
              value={
                vendor.website ? (
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {vendor.website}
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Field label="Note" value={vendor.note} />
            <Field
              label="Assignable to Jobs"
              value={
                vendor.assignable_to_jobs ? (
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
              label="Finances Visible"
              value={
                vendor.finances_visible ? (
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
          </div>
          <div className="space-y-4">
            <Field label="Country" value={vendor.country} />
            <Field label="State / Region" value={vendor.state_region} />
            <Field label="City" value={vendor.city} />
            <Field label="Address" value={vendor.address} />
            <Field label="Postal Code" value={vendor.postal_code} />
            <Field label="Tags" value={vendor.tag} />
            <Field label="Rating" value={vendor.rating} />      
            <Field
              label="Created At"
              value={
                vendor.createdAt
                  ? new Date(vendor.createdAt).toLocaleString()
                  : "—"
              }
            />
            <Field
              label="Registered At"
              value={
                vendor.registeredAt
                  ? new Date(vendor.registeredAt).toLocaleString()
                  : "—"
              }
            />
          </div>
        </div>
      </section>

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
            <Field label="Email" value={vendor.auth?.email} />
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
                vendor.can_login ? (
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
                vendor.invitedAt
                  ? new Date(vendor.invitedAt).toLocaleString()
                  : "—"
              }
            />
            <Field
              label="Last Activity At"
              value={
                vendor.lastActivityAt
                  ? new Date(vendor.lastActivityAt).toLocaleString()
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
          message="Are you sure you want to delete this vendor?"
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

export default VendorView;