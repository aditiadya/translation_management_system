import { FaTrash, FaDownload } from "react-icons/fa";

const ProjectInputFilesCard = ({ files = [], loading, onDelete, onUpload, onRefresh }) => {
  const formatSize = (bytes) => {
    if (!bytes) return "-";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getUploaderName = (doc) => {
    const details = doc.uploader?.details;
    if (details?.first_name) return `${details.first_name} ${details.last_name}`;
    if (doc.uploader?.email) return doc.uploader.email;
    return "-";
  };

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/download-file?path=${encodeURIComponent(doc.file_path)}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.original_file_name || "file";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Project Input Files ({files.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onUpload}
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
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white shadow rounded-lg overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500 py-6 text-sm">
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div className="text-center text-gray-500 py-6 text-sm">
              No project input files found. Upload files to get started.
            </div>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-[11px] tracking-widest border-b">
                  {["Code", "File Name", "Category", "Note", "Size", "Uploaded At", "Uploaded By", "Actions"].map((h) => (
                    <th key={h} className="px-3 py-2 text-center font-bold pl-5 pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {files.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {doc.file_code}
                    </td>
                    <td className="px-3 py-2 text-xs text-center break-words">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {doc.original_file_name}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {doc.category || "-"}
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {doc.note || "-"}
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {formatSize(doc.file_size)}
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {formatDate(doc.uploaded_at)}
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {getUploaderName(doc)}
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInputFilesCard;