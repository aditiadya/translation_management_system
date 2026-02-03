import { useState } from "react";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import BackButton from "../../../../components/Button/BackButton";

const ProjectDetailsCard = ({ project, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    onDelete();
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <BackButton to="/projects" />
          <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
        </div>

        <div className="space-x-4">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
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
          <div className="space-y-4">
            

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Client:
              </span>
              <span className="text-sm text-gray-900">
                {project.client?.company_name || "-"}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Client Contact Person:
              </span>
              <span className="text-sm text-gray-900">
                {project.client.contactPersons
                  ? `${project.client.contactPersons.first_name} 
                ${project.client.contactPersons.last_name}`
                  : "-"}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Project Name:
              </span>
              <span className="text-sm text-gray-900">
                {project.project_name}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Language Pairs:
              </span>
              <span className="text-sm text-gray-900">{project.project_name}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Specialization:
              </span>
              <span className="text-sm text-gray-900">{project.project_name}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Start At:
              </span>
              <span className="text-sm text-gray-900">{project.start_at ? formatDate(project.start_at) : "-"}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Deadline At:
              </span>
              <span className="text-sm text-gray-900">{project.deadline_at
                      ? formatDate(project.deadline_at)
                      : "-"}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Instructions:
              </span>
              <span className="text-sm text-gray-900">{project.instructions}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Legal Entity:
              </span>
              <span className="text-sm text-gray-900">{project.legal_entity}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Internal Note:
              </span>
              <span className="text-sm text-gray-900">{project.internal_note}</span>
            </div>

            <div className="flex">
              <span className="w-40 text-sm font-medium text-gray-700">
                Created At:
              </span>
              <span className="text-sm text-gray-900">{project.createdAt
                      ? formatDate(project.createdAt)
                      : "-"}</span>
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
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default ProjectDetailsCard;
