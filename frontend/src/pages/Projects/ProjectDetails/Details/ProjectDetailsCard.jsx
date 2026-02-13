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

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Format language pairs as comma-separated string
  const renderLanguagePairs = () => {
    if (!project.languagePairs || project.languagePairs.length === 0) {
      return <span>-</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {project.languagePairs.map((lp, index) => (
          <div
            key={index}
            className="
            border rounded-lg px-3 py-1
            text-sm bg-gray-50
            w-full sm:w-[350px]
          "
          >
            {lp.sourceLanguage?.name} → {lp.targetLanguage?.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      

      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <BackButton to="/projects" />
          <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
        </div>

        <div className="space-x-4">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Update
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
          <div className="space-y-4 pl-4">
            
            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Client:
              </span>
              <span className="text-sm text-gray-900">
                {project.client?.company_name ||
                  `${project.client?.primary_user?.first_name || ""} ${
                    project.client?.primary_user?.last_name || ""
                  }`.trim() ||
                  "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Contact Person:
              </span>
              <span className="text-sm text-gray-900">
                {project.contactPerson
                  ? `${project.contactPerson.first_name} ${project.contactPerson.last_name}`
                  : "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Project Name:
              </span>
              <span className="text-sm text-gray-900">
                {project.project_name || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Service:
              </span>
              <span className="text-sm text-gray-900">
                {project.service?.name || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Language Pairs:
              </span>

              <div className="flex-1">{renderLanguagePairs()}</div>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Specialization:
              </span>
              <span className="text-sm text-gray-900">
                {project.specialization?.name || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Start At:
              </span>
              <span className="text-sm text-gray-900">
                {project.start_at ? formatDateTime(project.start_at) : "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Deadline At:
              </span>
              <span className="text-sm text-gray-900">
                {project.deadline_at
                  ? formatDateTime(project.deadline_at)
                  : "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Instructions:
              </span>

              <div
                className="flex-1
      text-sm text-gray-900
      border rounded-lg px-3 py-2 bg-gray-50
      w-full sm:w-[420px]
    "
              >
                {project.instructions ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: project.instructions,
                    }}
                  />
                ) : (
                  "-"
                )}
              </div>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Legal Entity:
              </span>
              <span className="text-sm text-gray-900">
                {project.legal_entity || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Internal Note:
              </span>
              <span className="text-sm text-gray-900">
                {project.internal_note || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
                Created At:
              </span>
              <span className="text-sm text-gray-900">
                {project.createdAt ? formatDate(project.createdAt) : "-"}
              </span>
            </div>

          
          </div>
        
      </div>

      {isModalOpen && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this project? This action cannot be undone."
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
