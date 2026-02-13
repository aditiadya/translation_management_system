import { Pencil, Trash2, Copy } from "lucide-react";
import { Link } from "react-router-dom";

const JobsTable = ({
  data = [],
  selectedJobs = [],
  setSelectedJobs,
  onDelete,
  onClone,
  onEdit,
}) => {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Offered to Vendor":
        return "bg-purple-100 text-purple-700";
      case "Offer Accepted":
        return "bg-green-100 text-green-700";
      case "Offer Rejected":
        return "bg-red-100 text-red-700";
      case "Started":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-teal-100 text-teal-700";
      case "Hold":
        return "bg-yellow-100 text-yellow-700";
      case "Completion Accepted":
        return "bg-green-100 text-green-700";
      case "Completion Rejected":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(data.map((job) => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">
          {/* Column width control */}
          <colgroup>
            <col style={{ width: "3%" }} />
            <col style={{ width: "2%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "4%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
          </colgroup>

          <thead>
            <tr className="bg-white text-black-600 text-[11px] tracking-widest border-b">
              <th className="px-3 py-2 text-center font-bold">
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 && selectedJobs.length === data.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              {[
                "Code",
                "Name",
                "Service",
                "Language Pair",
                "Deadline At",
                "Vendor",
                "Status",
                "Start At",
                "Completed At",
                "Work Amount",
                "Payables, INR",
                "Project",
                "Primary Project Manager",
                "Actions",
              ].map((h) => (
                <th key={h} className="px-3 py-2 text-center font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  className="py-6 text-center text-gray-500 text-xs"
                >
                  No jobs found.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "hover:bg-gray-100"
                  }
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(row.id)}
                      onChange={() => handleSelectJob(row.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    <Link
                      to={`/project/${row.project_id}/job/${row.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      J{row.id}
                    </Link>
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.name || "—"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.service?.name || "—"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.languagePair
                      ? `${row.languagePair.sourceLanguage?.name || ""} → ${
                          row.languagePair.targetLanguage?.name || ""
                        }`
                      : "—"}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {formatDateTime(row.deadline_at)}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.vendor?.company_name ||
                      `${row.vendor?.primary_users?.first_name || ""} ${
                        row.vendor?.primary_users?.last_name || ""
                      }`.trim() ||
                      "—"}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {formatDateTime(row.started_at)}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {formatDateTime(row.completed_at)}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.work_amount || "—"}
                  </td>

                  <td className="px-3 py-2 text-xs text-right whitespace-nowrap">
                    {row.payables_amount
                      ? `₹${parseFloat(row.payables_amount).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : "—"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    <Link
                      to={`/project/${row.project_id}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {row.project?.project_name || "—"}
                    </Link>
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.project?.primaryManager
                      ? `${row.project.primaryManager.first_name} ${row.project.primaryManager.last_name}`
                      : "—"}
                  </td>

                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-3">
                      <Copy
                        className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                        title="Clone Job"
                        onClick={() => onClone(row.id)}
                      />
                      <Pencil
                        className="w-4 h-4 text-blue-500 hover:text-blue-600 cursor-pointer"
                        title="Edit Job"
                        onClick={() => onEdit(row.id)}
                      />
                      <Trash2
                        className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer"
                        title="Delete Job"
                        onClick={() => onDelete(row.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsTable;