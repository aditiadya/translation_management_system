import { Link } from "react-router-dom";

const Row = ({ label, value }) => {
  const displayValue =
    value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className="flex border-b last:border-b-0 text-sm">
      <div className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-700">
        {label}
      </div>
      <div className="w-2/3 px-4 py-3 text-gray-900">{displayValue}</div>
    </div>
  );
};

const AssignmentStatusCard = ({
  job,
  onAccept,
  onReject,
  onCancel,
  onDraft,
  onOffer,
  onStart,
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

  const getDeadlineStatus = () => {
    if (!job?.deadline_at) return null;

    const now = new Date();
    const deadline = new Date(job.deadline_at);
    const diffMs = deadline - now;

    if (diffMs < 0) {
      const absMs = Math.abs(diffMs);
      const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      return {
        text: `Overdue by ${days} day${days !== 1 ? "s" : ""}${
          hours ? `, ${hours} hour${hours !== 1 ? "s" : ""}` : ""
        }`,
        isOverdue: true,
      };
    }

    return {
      text: formatDateTime(job.deadline_at),
      isOverdue: false,
    };
  };

  const deadlineStatus = getDeadlineStatus();

  const getVendorName = () => {
    if (!job?.vendor) return null;
    return (
      job.vendor.company_name ||
      `${job.vendor.primary_users?.first_name || ""} ${
        job.vendor.primary_users?.last_name || ""
      }`.trim()
    );
  };

  const getVendorContactName = () => {
    if (!job?.vendorContactPerson) return null;
    return `${job.vendorContactPerson.first_name} ${job.vendorContactPerson.last_name}`;
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

  const showActionRequired =
    job?.status === "Completed" || job?.status === "Offer Accepted";

  const getActionMessage = () => {
    if (job?.status === "Completed") {
      return "Job is completed and awaiting manager review.";
    }
    if (job?.status === "Offer Accepted") {
      return "Job offer has been accepted by vendor. Ready to start.";
    }
    return "";
  };

  return (
    <div className="bg-white shadow rounded-lg  space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Job Assignment & Status
        </h3>

        <div className="flex gap-2 flex-wrap">
          {job?.status === "Draft" && (
            <button
              onClick={onOffer}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Offer to Vendor
            </button>
          )}

          {job?.status === "Offer Accepted" && (
            <button
              onClick={onStart}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Start Job
            </button>
          )}

          {job?.status === "Completed" && (
            <>
              <button
                onClick={onAccept}
                className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
              >
                Accept Completion
              </button>
              <button
                onClick={onReject}
                className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600"
              >
                Reject Completion
              </button>
            </>
          )}

          {(job?.status === "Started" || job?.status === "Hold") && (
            <button
              onClick={onCancel}
              className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
            >
              Cancel
            </button>
          )}

          {job?.status !== "Draft" && (
            <button
              onClick={onDraft}
              className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
            >
              Move to Draft
            </button>
          )}
        </div>
      </div>

      {/* Status Alert (only if action required) */}
      {showActionRequired && (
        <div className="flex gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-sm">
          <div className="font-semibold text-green-700">Action required</div>
          <div className="text-green-700">{getActionMessage()}</div>
        </div>
      )}

      {/* Details */}
      <div className="border rounded-md overflow-hidden">
        <Row
          label="Vendor"
          value={
            job?.vendor ? (
              <Link
                to={`/vendors/${job.vendor.id}`}
                className="text-blue-600 hover:underline"
              >
                {getVendorName()}
              </Link>
            ) : (
              "—"
            )
          }
        />

        <Row
          label="Vendor contact person"
          value={getVendorContactName() || "—"}
        />

        <Row
          label="Status"
          value={
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                job?.status
              )}`}
            >
              {job?.status || "—"}
            </span>
          }
        />

        <Row
          label="Deadline"
          value={
            deadlineStatus?.isOverdue ? (
              <span className="text-red-600 font-medium">
                {deadlineStatus.text}
              </span>
            ) : (
              deadlineStatus?.text || "—"
            )
          }
        />

        {job?.started_at && (
          <Row label="Started At" value={formatDateTime(job.started_at)} />
        )}

        {job?.completed_at && (
          <Row label="Completed At" value={formatDateTime(job.completed_at)} />
        )}
      </div>
    </div>
  );
};

export default AssignmentStatusCard;