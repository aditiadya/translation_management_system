import { Link } from "react-router-dom";

const VendorJobsTable = ({ data = [], onRefresh }) => {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "â€”";
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

  return (
    <div className="w-full bg-white shadow rounded-lg overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">
          <colgroup>
            <col style={{ width: "4%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "11%" }} />
          </colgroup>

          <thead>
            <tr className="bg-white text-black-600 text-[11px] tracking-widest border-b">
              {[
                "Code",
                "Name",
                "Service",
                "Language Pair",
                "Deadline At",
                "Status",
                "Start At",
                "Completed At",
                "Work Amount",
                "Project",
                "Primary Project Manager",
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
                  colSpan={11}
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
                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    <Link
                      to={`/vendor/job/${row.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      LT{row.id}
                    </Link>
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.name || "â€”"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.service?.name || "â€”"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.languagePair
                      ? `${row.languagePair.sourceLanguage?.name || ""} â†’ ${
                          row.languagePair.targetLanguage?.name || ""
                        }`
                      : "â€”"}
                  </td>

                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {formatDateTime(row.deadline_at)}
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
                    {row.work_amount || "â€”"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.project?.project_name || "â€”"}
                  </td>

                  <td className="px-3 py-2 text-xs break-words">
                    {row.project?.primaryManager
                      ? `${row.project.primaryManager.first_name} ${row.project.primaryManager.last_name}`
                      : "â€”"}
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

export default VendorJobsTable;
