import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import JobStatusStepper from "../Projects/ProjectDetails/Jobs/JobDetails/JobStatusStepper";
import VendorUploadOutputFileModal from "./VendorUploadOutputFileModal";

/* â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const BACKEND = "http://localhost:5000/api";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtSize = (bytes) => {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
};

const fmtNum = (v) =>
  v !== undefined && v !== null && v !== "" ? Number(v).toFixed(2) : "—";

/* â”€â”€â”€ Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Row = ({ label, value }) => (
  <div className="flex border-b last:border-b-0 text-sm">
    <div className="w-1/3 bg-gray-50 px-4 py-3 font-medium text-gray-700">{label}</div>
    <div className="w-2/3 px-4 py-3 text-gray-900">{value ?? "—"}</div>
  </div>
);

/* â”€â”€â”€ Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Section = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    <div className="border rounded-md overflow-hidden">{children}</div>
  </div>
);

/* â”€â”€â”€ Status badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const statusColor = (s) => {
  const map = {
    "Draft": "bg-gray-100 text-gray-700",
    "Offered to Vendor": "bg-purple-100 text-purple-700",
    "Offer Accepted": "bg-green-100 text-green-700",
    "Offer Rejected": "bg-red-100 text-red-700",
    "Started": "bg-blue-100 text-blue-700",
    "Completed": "bg-teal-100 text-teal-700",
    "Hold": "bg-yellow-100 text-yellow-700",
    "Completion Accepted": "bg-green-100 text-green-700",
    "Completion Rejected": "bg-red-100 text-red-700",
    "Cancelled": "bg-gray-100 text-gray-700",
  };
  return map[s] || "bg-gray-100 text-gray-700";
};

/* â”€â”€â”€ Receivables table (read-only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ReceivablesCard = ({ data = [] }) => {
  const COLS = [
    "Type", "Code", "Invoice", "Unit amount", "Unit",
    "Price per unit", "Subtotal", "Extra charge", "Discount",
    "Total", "Currency", "Note for vendor", "Filename",
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="pt-6 pl-6 pr-6 pb-3">
        <h3 className="text-base font-semibold text-gray-800">
          Receivables
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-xs min-w-[960px]">
          <thead>
            <tr className="bg-gray-50 border-b text-[11px] tracking-widest">
              {COLS.map((h) => (
                <th key={h} className="px-3 py-2 text-center font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="py-6 text-center text-gray-400">
                  No receivables found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                const isFlat = row.type === "flat_rate";
                const currCode = row.currency?.currency?.code || "—";
                return (
                  <tr key={`${row.type}-${row.id}`} className={i % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${isFlat ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>
                        {isFlat ? "Flat rate" : "Unit based"}
                      </span>
                    </td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2 text-right">{isFlat ? "—" : fmtNum(row.unit_amount)}</td>
                    <td className="px-3 py-2">{isFlat ? "—" : (row.unit?.name || "—")}</td>
                    <td className="px-3 py-2 text-right">{isFlat ? "—" : fmtNum(row.price_per_unit)}</td>
                    <td className="px-3 py-2 text-right">{fmtNum(row.subtotal)}</td>
                    <td className="px-3 py-2 text-right">{fmtNum(row.extra_charge)}</td>
                    <td className="px-3 py-2 text-right">{fmtNum(row.discount)}</td>
                    <td className="px-3 py-2 text-right font-semibold">{fmtNum(row.total ?? row.subtotal)}</td>
                    <td className="px-3 py-2">{currCode}</td>
                    <td className="px-3 py-2">{row.note_for_vendor || "—"}</td>
                    <td className="px-3 py-2 text-blue-600">
                      {row.file?.original_file_name || row.file?.file_name || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Input files card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const InputFilesCard = ({ files = [], jobId, downloading, onDownloadZip, onDownloadSingle }) => {
  return (
    <div className="bg-white shadow rounded-lg space-y-4">
      <div className="flex justify-between items-center pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Linked input files ({files.length})
        </h3>
        <button
          onClick={onDownloadZip}
          disabled={downloading || files.length === 0}
          className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {downloading ? "Downloading..." : "Download as zip"}
        </button>
      </div>

      <div className="max-h-[220px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] tracking-widest border-b">
              {["File #", "Filename", "Size", "Category", "Note", "Uploaded at", "Uploaded by", "Output from job"].map((h) => (
                <th key={h} className="px-3 py-2 text-center font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500 text-xs">
                  No input files linked.
                </td>
              </tr>
            ) : (
              files.map((file, idx) => {
                const fileName = file.is_linked
                  ? file.linkedProjectFile?.original_file_name || "—"
                  : file.original_file_name || "—";
                const fileSize = fmtSize(
                  file.is_linked ? file.linkedProjectFile?.file_size : file.file_size
                );
                return (
                  <tr key={file.id || idx} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}>
                    <td className="px-3 py-2 text-xs">{file.file_code || `#${idx + 1}`}</td>
                    <td className="px-3 py-2 text-xs">
                      <button
                        onClick={() => onDownloadSingle(file, "input")}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {fileName}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{fileSize}</td>
                    <td className="px-3 py-2 text-xs">{file.category || "—"}</td>
                    <td className="px-3 py-2 text-xs">{file.note || "—"}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{fmtDate(file.uploaded_at)}</td>
                    <td className="px-3 py-2 text-xs">{file.uploaded_by || "—"}</td>
                    <td className="px-3 py-2 text-xs">{file.output_from_job || "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* â”€â”€â”€ Output files card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const OutputFilesCard = ({ files = [], jobId, downloading, onDownloadZip, onDownloadSingle, onUpload, status }) => {
  return (
    <div className="bg-white shadow rounded-lg space-y-4">
      <div className="flex justify-between items-center pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Output files ({files.length})
        </h3>
        <div className="flex gap-2">
          {status === "Started" && (
            <button
              onClick={onUpload}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Upload
            </button>
          )}
          <button
            onClick={onDownloadZip}
            disabled={downloading || files.length === 0}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {downloading ? "Downloading..." : "Download as zip"}
          </button>
        </div>
      </div>

      <div className="max-h-[220px] overflow-y-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] tracking-widest border-b">
              {["File #", "Filename", "Size", "Uploaded at", "Uploaded by", "Input for jobs", "Is project output"].map((h) => (
                <th key={h} className="px-3 py-2 text-center font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500 text-xs">
                  No output files found.
                </td>
              </tr>
            ) : (
              files.map((file, idx) => {
                const uploader = file.adminUploader?.details
                  ? `${file.adminUploader.details.first_name} ${file.adminUploader.details.last_name}`
                  : file.vendorUploader?.company_name || "—";
                return (
                  <tr key={file.id || idx} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}>
                    <td className="px-3 py-2 text-xs">{file.file_code || `#${idx + 1}`}</td>
                    <td className="px-3 py-2 text-xs">
                      <button
                        onClick={() => onDownloadSingle(file, "output")}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {file.original_file_name || "—"}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{fmtSize(file.file_size)}</td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{fmtDate(file.uploaded_at)}</td>
                    <td className="px-3 py-2 text-xs">{uploader}</td>
                    <td className="px-3 py-2 text-xs">{file.input_for_job || "—"}</td>
                    <td className="px-3 py-2 text-xs">{file.is_project_output ? "Yes" : "No"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   Main page
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const VendorJobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [inputDownloading, setInputDownloading] = useState(false);
  const [outputDownloading, setOutputDownloading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/vendor-jobs/${jobId}`, { withCredentials: true });
      setJob(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchJob();
  }, [jobId]);

  /* â”€â”€ Accept / Reject offer â”€â”€ */
  const handleAcceptOffer = async () => {
    if (!window.confirm("Accept this job offer?")) return;
    setActionLoading(true);
    try {
      await api.post(`/vendor-jobs/${jobId}/accept`, {}, { withCredentials: true });
      await fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept offer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOffer = async () => {
    const comment = prompt("Enter reason for rejection (optional):");
    if (comment === null) return; // user cancelled
    setActionLoading(true);
    try {
      await api.post(`/vendor-jobs/${jobId}/reject`, { comment }, { withCredentials: true });
      await fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject offer");
    } finally {
      setActionLoading(false);
    }
  };

  /* â”€â”€ File downloads â”€â”€ */
  const handleDownloadSingle = async (file, type) => {
    try {
      const filePath = type === "input"
        ? (file.is_linked ? file.linkedProjectFile?.file_path : file.file_path)
        : file.file_path;

      if (!filePath) { alert("File path not available"); return; }

      const res = await fetch(
        `${BACKEND}/download-file?path=${encodeURIComponent(filePath)}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        type === "input"
          ? (file.is_linked ? file.linkedProjectFile?.original_file_name : file.original_file_name) || "file"
          : file.original_file_name || "file";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to download file");
    }
  };

  const handleDownloadInputZip = async () => {
    try {
      setInputDownloading(true);
      const res = await fetch(
        `${BACKEND}/vendor-jobs/${jobId}/download-input-zip`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job-${jobId}-input-files.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch { alert("Failed to download zip"); }
    finally { setInputDownloading(false); }
  };

  const handleDownloadOutputZip = async () => {
    try {
      setOutputDownloading(true);
      const res = await fetch(
        `${BACKEND}/vendor-jobs/${jobId}/download-output-zip`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job-${jobId}-output-files.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch { alert("Failed to download zip"); }
    finally { setOutputDownloading(false); }
  };

  const handleUploadOutput = () => {
    setShowUploadModal(true);
  };

  /* —— Complete job —— */
  const handleCompleteJob = async () => {
    if (!window.confirm("Mark this job as completed?")) return;
    setActionLoading(true);
    try {
      await api.post(`/vendor-jobs/${jobId}/complete`, {}, { withCredentials: true });
      await fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete job");
    } finally {
      setActionLoading(false);
    }
  };

  /* â”€â”€ Loading / error states â”€â”€ */
  if (loading) return <div className="text-center mt-10 text-gray-500">Loading job details...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-medium">{error}</div>;
  if (!job) return <div className="text-center mt-10 text-gray-500">Job not found.</div>;

  const langPair = job.languagePair
    ? `${job.languagePair.sourceLanguage?.name || ""} \u2192 ${job.languagePair.targetLanguage?.name || ""}`
    : "—";

  const primaryManager = job.project?.primaryManager
    ? `${job.project.primaryManager.first_name} ${job.project.primaryManager.last_name}`
    : "—";

  const deadlineDisplay = () => {
    if (!job.deadline_at) return "—";
    const now = new Date();
    const deadline = new Date(job.deadline_at);
    const diff = deadline - now;
    if (diff < 0) {
      const abs = Math.abs(diff);
      const days = Math.floor(abs / 86400000);
      const hours = Math.floor((abs % 86400000) / 3600000);
      return (
        <span className="text-red-600 font-medium">
          Overdue by {days}d {hours}h ({fmtDate(job.deadline_at)})
        </span>
      );
    }
    return fmtDate(job.deadline_at);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/jobs")}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Job details</h2>
      </div>

      {/* Status stepper */}
      <div className="bg-white shadow rounded-lg p-4">
        <JobStatusStepper current={job.status} statusHistory={job.statusHistory || []} />
      </div>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left — Job info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-8">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">JOB LT{job.id}</h2>
              <button
                onClick={() => alert("PO download coming soon!")}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
              >
                Download PO
              </button>
            </div>

            <Section title="Requirements">
              <Row label="Name" value={job.name} />
              <Row label="Service" value={job.service?.name} />
              <Row label="Language pair" value={langPair} />
              <Row label="Project specialization" value={job.project?.specialization?.name} />
              <Row label="Deadline at" value={fmtDate(job.deadline_at)} />
            </Section>

            <Section title="Setup">
              <Row
                label="Auto start on vendor acceptance"
                value={job.auto_start_on_vendor_acceptance ? "Yes" : "No"}
              />
              <Row label="Instructions" value={job.instructions} />
            </Section>
          </div>
        </div>

        {/* Right — Assignment & Status */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white shadow rounded-lg space-y-6">
            <div className="flex justify-between items-start pt-6 pl-6 pr-6">
              <h3 className="text-base font-semibold text-gray-800">Job Assignment & Status</h3>

              <div className="flex gap-2 flex-wrap">
                {job.status === "Offered to Vendor" && (
                  <>
                    <button
                      onClick={handleAcceptOffer}
                      disabled={actionLoading}
                      className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={handleRejectOffer}
                      disabled={actionLoading}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject Offer
                    </button>
                  </>
                )}
                {job.status === "Started" && job.outputFiles?.some((f) => f.vendorUploader) && (
                  <button
                    onClick={handleCompleteJob}
                    disabled={actionLoading}
                    className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Complete Job
                  </button>
                )}
              </div>
            </div>

            {job.status === "Offered to Vendor" && (
              <div className="mx-6 flex gap-3 rounded-md border border-purple-200 bg-purple-50 p-4 text-sm">
                <div className="font-semibold text-purple-700">Action required</div>
                <div className="text-purple-700">You have a pending job offer. Please accept or reject.</div>
              </div>
            )}

            {job.status === "Started" && job.outputFiles?.some((f) => f.vendorUploader) && (
              <div className="mx-6 flex gap-3 rounded-md border border-green-200 bg-green-50 p-4 text-sm">
                <div className="font-semibold text-green-700">Ready to complete</div>
                <div className="text-green-700">You have uploaded output files. You can now mark this job as completed.</div>
              </div>
            )}

            <div className="border rounded-md overflow-hidden mx-6 mb-6">
              <Row label="Project" value={job.project?.project_name} />
              <Row label="Primary project manager" value={primaryManager} />
              <Row
                label="Status"
                value={
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(job.status)}`}>
                    {job.status}
                  </span>
                }
              />
              <Row label="Deadline" value={deadlineDisplay()} />
              <Row label="Started at" value={fmtDate(job.started_at)} />
              <Row label="Completed at" value={fmtDate(job.completed_at)} />
            </div>
          </div>
        </div>
      </div>

      {/* Receivables */}
      <ReceivablesCard data={job.receivables || []} />

      {/* Input files — full width */}
      <InputFilesCard
        files={job.inputFiles || []}
        jobId={jobId}
        downloading={inputDownloading}
        onDownloadZip={handleDownloadInputZip}
        onDownloadSingle={handleDownloadSingle}
      />

      {/* Output files — full width, separate level */}
      <OutputFilesCard
        files={job.outputFiles || []}
        jobId={jobId}
        downloading={outputDownloading}
        onDownloadZip={handleDownloadOutputZip}
        onDownloadSingle={handleDownloadSingle}
        onUpload={handleUploadOutput}
        status={job.status}
      />

      {/* Messages */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">Messages</h3>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end">
          <button
            disabled={!message.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {/* Upload output file modal */}
      {showUploadModal && (
        <VendorUploadOutputFileModal
          jobId={jobId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchJob();
          }}
        />
      )}
    </div>
  );
};

export default VendorJobDetailPage;

