import { useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../../../../../utils/axiosInstance";
import UploadOutputFileModal from "./UploadOutputFileModal";

const OutputFilesCard = ({ jobId, files = [], onRefresh }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
        { credentials: "include" }
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
    if (files.length === 0) {
      alert("No files to download");
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/job-output-files/download-zip?job_id=${jobId}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job-${jobId}-output-files.zip`;
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
    if (!window.confirm(`Are you sure you want to delete "${file.original_file_name}"?`)) {
      return;
    }

    try {
      await api.delete(`/job-output-files/${file.id}`, { withCredentials: true });
      alert("File deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete file");
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pt-6 pl-6 pr-6">
          <h3 className="text-base font-semibold text-gray-800">
            Output files ({files.length})
          </h3>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Upload
            </button>

            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Add URL
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={downloading || files.length === 0}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {downloading ? "Downloading..." : "Download as zip"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full bg-white shadow rounded-lg overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-black-600 text-[11px] tracking-widest border-b">
                  {[
                    "File #",
                    "Filename",
                    "Size",
                    "Uploaded at",
                    "Uploaded by",
                    "Input for jobs",
                    "Is project output",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2 text-center font-bold pl-2 pr-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500 text-xs">
                      No output files found.
                    </td>
                  </tr>
                ) : (
                  files.map((file, index) => (
                    <tr
                      key={file.id || index}
                      className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                    >
                      <td className="px-3 py-2 text-xs whitespace-nowrap">
                        {file.file_code || `#${index + 1}`}
                      </td>

                      <td className="px-3 py-2 text-xs break-words">
                        <button
                          onClick={() => handleDownloadSingle(file)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {file.original_file_name || "—"}
                        </button>
                      </td>

                      <td className="px-3 py-2 text-xs whitespace-nowrap">
                        {formatFileSize(file.file_size)}
                      </td>

                      <td className="px-3 py-2 text-xs whitespace-nowrap">
                        {formatDateTime(file.uploaded_at)}
                      </td>

                      <td className="px-3 py-2 text-xs whitespace-nowrap">
                        {file.adminUploader?.details
                          ? `${file.adminUploader.details.first_name} ${file.adminUploader.details.last_name}`
                          : file.vendorUploader
                          ? `${file.vendorUploader.company_name || "Vendor"}`
                          : "—"}
                      </td>

                      <td className="px-3 py-2 text-xs whitespace-nowrap">
                        {file.input_for_job || "—"}
                      </td>

                      <td className="px-3 py-2 text-xs whitespace-nowrap text-center">
                        {file.is_project_output ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>

                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <Trash2
                          className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer mx-auto"
                          onClick={() => handleDelete(file)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadOutputFileModal
          jobId={jobId}
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

export default OutputFilesCard;