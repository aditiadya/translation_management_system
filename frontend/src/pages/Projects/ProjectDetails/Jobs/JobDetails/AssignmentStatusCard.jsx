const Row = ({ label, value }) => {
const displayValue =
value === null ||
value === undefined ||
value === ""
? "—"
: value;


return (
<div className="flex border-b last:border-b-0 text-sm">
<div className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-700">
{label}
</div>
<div className="w-2/3 px-4 py-3 text-gray-900">
{displayValue}
</div>
</div>
);
};

const AssignmentStatusCard = ({
  assignment,
  onAccept,
  onReject,
  onCancel,
  onDraft,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-gray-800">
          Job Assignment & Status
        </h3>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onAccept}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="bg-yellow-500 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-600"
          >
            Reject
          </button>
          <button
            onClick={onCancel}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Cancel
          </button>
          <button
            onClick={onDraft}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Draft
          </button>
        </div>
      </div>

      {/* Status Alert (only if action required) */}
      {assignment?.action_required && (
        <div className="flex gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-sm">
          <div className="font-semibold text-green-700">
            Action required
          </div>
          <div className="text-green-700">
            {assignment?.action_message ||
              "Job results are awaiting review by the manager."}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="border rounded-md overflow-hidden">
        <Row
          label="Vendor"
          value={
            assignment?.vendor_name ? (
              <span className="text-blue-600 cursor-pointer hover:underline">
                {assignment.vendor_name}
              </span>
            ) : null
          }
        />

        <Row
          label="Vendor contact person"
          value={
            assignment?.vendor_contact ? (
              assignment.vendor_contact
            ) : (
              <button
                onClick={assignment?.onAssignVendor}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
              >
                Assign
              </button>
            )
          }
        />

        <Row
          label="Status"
          value={assignment?.status}
        />

        <Row
          label="Deadline"
          value={
            assignment?.deadline_overdue_text ? (
              <span className="text-red-600 font-medium">
                {assignment.deadline_overdue_text}
              </span>
            ) : assignment?.deadline
          }
        />
      </div>
    </div>
  );
};

export default AssignmentStatusCard;