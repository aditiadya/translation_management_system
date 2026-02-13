const ManagerStatusCard = ({ project }) => {
  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white shadow rounded-lg p-8">
         <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Manager & Status</h2>
        </div>

        <div className="space-x-4">
          <button
            
            className="bg-yellow-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-yellow-700"
          >
            Complete
          </button>

          <button
           
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Cancel
          </button>
        </div>

        </div>

        <div className="space-y-4">

      {/* Primary Manager */}
      <div className="flex items-start">
        <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
          Primary Manager:
        </span>

        <div className="text-sm text-gray-900">
          {project.primaryManager
            ? `${project.primaryManager.first_name} ${project.primaryManager.last_name}`
            : "-"}
        </div>
      </div>

      {/* Secondary Manager */}
      <div className="flex items-start">
        <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
          Secondary Manager:
        </span>

        <div className="text-sm text-gray-900">
          {project.secondaryManager
            ? `${project.secondaryManager.first_name} ${project.secondaryManager.last_name}`
            : "-"}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-start">
        <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
          Status:
        </span>

        <div className="text-sm text-gray-900">
          {project.status || "-"}
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-start">
        <span className="w-40 text-sm font-medium text-gray-700 shrink-0">
          Deadline:
        </span>

        <div className="text-sm text-gray-900">
          {project.deadline_at
            ? formatDateTime(project.deadline_at)
            : "-"}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ManagerStatusCard;