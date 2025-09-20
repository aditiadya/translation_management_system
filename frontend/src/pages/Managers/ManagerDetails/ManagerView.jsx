import { useState } from "react";
import ConfirmModal from "../../../components/Modals/ConfirmModal";

const ManagerView = ({ manager, onEdit, onResendInvitation, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    onDelete();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manager Details</h1>

        <div className="space-x-4">
          <button
            onClick={onEdit}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            Update
          </button>
          <button
            onClick={onResendInvitation}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Resend Invitation
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
          <div className="space-y-4">
            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Full Name:</span>
              <span className="text-gray-900">
                {manager.first_name} {manager.last_name}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Gender:</span>
              <span className="text-gray-900 capitalize">{manager.gender}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Email:</span>
              <span className="text-blue-600 underline">
                {manager.auth.email}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{manager.phone}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Can Login:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  manager.can_login
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {manager.can_login ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Role:</span>
              <span className="text-gray-900">
                {manager.role.role_id === 1
                  ? "Administrator"
                  : manager.role.role_id === 2
                  ? "Project Manager"
                  : "Translation Manager"}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">
                Client Pool:
              </span>
              <span className="text-gray-900">{manager.client_pool}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Teams ID:</span>
              <span className="text-gray-900">{manager.teams_id}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Zoom ID:</span>
              <span className="text-gray-900">{manager.zoom_id}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-medium text-gray-700">Timezone:</span>
              <span className="text-gray-900">{manager.timezone}</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this manager?"
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

export default ManagerView;