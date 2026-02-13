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

const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    <div className="border rounded-md overflow-hidden">{children}</div>
  </div>
);

const JobDetailsInfoCard = ({
  job,
  onDownloadPO,
  onClone,
  onUpdate,
  onDelete,
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

  const getLanguagePair = () => {
    if (!job?.languagePair) return "—";
    return `${job.languagePair.sourceLanguage?.name || ""} → ${
      job.languagePair.targetLanguage?.name || ""
    }`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-900">JOB J{job?.id || "—"}</h2>

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
        <Row label="Service" value={job?.service?.name} />
        <Row label="Language pair" value={getLanguagePair()} />
        <Row
          label="Project specialization"
          value={job?.project?.specialization?.name}
        />
        <Row label="Deadline at" value={formatDateTime(job?.deadline_at)} />
      </Section>

      {/* Setup */}
      <Section title="Setup">
        <Row
          label="Auto start on vendor acceptance"
          value={job?.auto_start_on_vendor_acceptance ? "Yes" : "No"}
        />
        <Row
          label="Checklist"
          value={
            job?.checklist?.name ? (
              <Link
                to={`/checklists/${job.checklist.id}`}
                className="text-blue-600 hover:underline"
              >
                {job.checklist.name}
              </Link>
            ) : (
              "—"
            )
          }
        />
        <Row label="Note for vendor" value={job?.note_for_vendor} />
      </Section>

      {/* Other details */}
      <Section title="Other details">
        <Row label="Legal entity" value={job?.legal_entity || "—"} />
        <Row label="Job PO PDF template" value={`Template ${job?.pdf_template_id || "—"}`} />
        <Row label="Internal note" value={job?.internal_note} />
      </Section>
    </div>
  );
};

export default JobDetailsInfoCard;