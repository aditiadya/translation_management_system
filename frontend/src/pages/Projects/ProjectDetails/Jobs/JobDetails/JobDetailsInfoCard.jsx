import { useParams } from "react-router-dom";

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

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-base font-semibold text-gray-800">
      {title}
    </h3>
    <div className="border rounded-md overflow-hidden">
      {children}
    </div>
  </div>
);

const JobDetailsInfoCard = ({ job, onDownloadPO, onClone, onUpdate, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-900">
          JOB {job?.job_id || "—"}
        </h2>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onDownloadPO}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Download PO
          </button>

          <button
            onClick={onClone}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Clone
          </button>

          <button
            onClick={onUpdate}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Update
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Requirements */}
      <Section title="Requirements">
        <Row label="Name" value={job?.name} />
        <Row label="Service" value={job?.service} />
        <Row label="Language pair" value={job?.language_pair} />
        <Row label="Project specialization" value={job?.specialization} />
        <Row label="Deadline at" value={job?.deadline_at} />
      </Section>

      {/* Setup */}
      <Section title="Setup">
        <Row
          label="Auto start on vendor acceptance"
          value={job?.auto_start ? "Yes" : "No"}
        />
        <Row
          label="Checklist"
          value={
            job?.checklist_name ? (
              <span className="text-blue-600 cursor-pointer hover:underline">
                {job.checklist_name}
              </span>
            ) : null
          }
        />
        <Row label="Note for vendor" value={job?.vendor_note} />
      </Section>

      {/* Other details */}
      <Section title="Other details">
        <Row label="Legal entity" value={job?.legal_entity} />
        <Row
          label="Job PO PDF template"
          value={job?.po_template}
        />
        <Row label="Internal note" value={job?.internal_note} />
      </Section>
    </div>
  );
};

export default JobDetailsInfoCard;