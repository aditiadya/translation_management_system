import { useState, useEffect } from "react";
import { Trash2, Download } from "lucide-react";
import UploadProjectOutputModal from "./UploadProjectOutputModal";
import api from "../../../../utils/axiosInstance";

const ProjectOutputFilesCard = ({ projectId, files = [], onRefresh }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [jobDetailsMap, setJobDetailsMap] = useState({});

  // Fetch job details for all unique job_ids in files
  useEffect(() => {
    const uniqueJobIds = [
      ...new Set(files.map((f) => f.job_id).filter(Boolean)),
    ];
    if (uniqueJobIds.length === 0) return;

    const fetchJobDetails = async () => {
      try {
        const results = await Promise.all(
          uniqueJobIds.map((jobId) =>
            api
              .get(`/jobs/${jobId}`, { withCredentials: true })
              .then((res) => ({ jobId, data: res.data.data }))
              .catch(() => ({ jobId, data: null })),
          ),
        );

        const map = {};
        results.forEach(({ jobId, data }) => {
          if (data) map[jobId] = data;
        });
        setJobDetailsMap(map);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      }
    };

    fetchJobDetails();
  }, [files]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

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

  const handleDownloadSingle = async (file) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/download-file?path=${encodeURIComponent(file.file_path)}`,
        { credentials: "include" },
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.original_file_name || "file";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  const handleDownloadZip = async () => {
    if (files.length === 0) return alert("No files to download");
    try {
      setDownloading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/project-output-files/download-zip?project_id=${projectId}`,
        { credentials: "include" },
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-${projectId}-output-files.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download zip error:", error);
      alert("Failed to download files as zip");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (file) => {
    if (
      !window.confirm(
        `Are you sure you want to remove "${file.original_file_name}" from project output?`,
      )
    )
      return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/project-output-files/${file.id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete file");
      }
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete file");
    }
  };

  const getJobField = (jobId, field) => {
    const job = jobDetailsMap[jobId];
    if (!job) return "—";

    switch (field) {
      case "service":
        return typeof job.service === "object"
          ? job.service?.name || "—"
          : job.service_name || job.service || "—";

      case "lang_pair":
        return job.languagePair?.sourceLanguage?.name &&
          job.languagePair?.targetLanguage?.name
          ? `${job.languagePair.sourceLanguage.name} → ${job.languagePair.targetLanguage.name}`
          : "—";

      case "vendor":
        if (!job.vendor) return "—";
        if (job.vendor.type === "Company") {
          return job.vendor.company_name || "—";
        }
        const firstName = job.vendor.primary_users?.first_name || "";
        const lastName = job.vendor.primary_users?.last_name || "";
        return `${firstName} ${lastName}`.trim() || "—";
      default:
        return "—";
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pt-6 pl-6 pr-6">
          <h3 className="text-base font-semibold text-gray-800">
            Project Output Files ({files.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Upload
            </button>
            <button
              onClick={() => alert("Add URL feature coming soon!")}
              className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700"
            >
              Add URL
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={downloading || files.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Downloading..." : "Download as ZIP"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full bg-white shadow rounded-lg overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-[11px] tracking-widest border-b">
                  {[
                    "File #",
                    "Filename",
                    "Size",
                    "Uploaded at",
                    "Uploaded by",
                    "Job Code",
                    "Job Service",
                    "Job Language Pair",
                    "Job Vendor",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-center font-bold pl-5 pr-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-6 text-center text-gray-500 text-xs"
                    >
                      No project output files found.
                    </td>
                  </tr>
                ) : (
                  files.map((file, index) => (
                    <tr
                      key={file.id || index}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.file_code || `#${index + 1}`}
                      </td>

                      <td className="px-3 py-2 text-xs text-center break-words">
                        <button
                          onClick={() => handleDownloadSingle(file)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {file.original_file_name || "—"}
                        </button>
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {formatFileSize(file.file_size)}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {formatDateTime(file.uploaded_at)}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.uploader?.details
                          ? `${file.uploader.details.first_name} ${file.uploader.details.last_name}`
                          : file.uploader?.email || "—"}
                      </td>

                      {/* Job Code — blank for now */}
                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        —
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.job_id
                          ? getJobField(file.job_id, "service")
                          : "—"}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.job_id
                          ? getJobField(file.job_id, "lang_pair")
                          : "—"}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.job_id ? getJobField(file.job_id, "vendor") : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadProjectOutputModal
          projectId={projectId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default ProjectOutputFilesCard;