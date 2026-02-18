import { useState } from "react";

const LinkedInputFilesCard = ({ projectId, files = [] }) => {

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const handleDownloadSingle = async (file) => {
    try {
      const filePath = file.is_linked
        ? file.linkedProjectFile?.file_path
        : file.file_path;

      if (!filePath) {
        alert("File path not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/download-file?path=${encodeURIComponent(filePath)}`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        file.original_file_name ||
        file.linkedProjectFile?.original_file_name ||
        "file";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  const getFileName = (file) => {
    if (file.is_linked) {
      return file.linkedProjectFile?.original_file_name || "—";
    }
    return file.original_file_name || "—";
  };

  const getFileSize = (file) => {
    if (file.is_linked) {
      return formatFileSize(file.linkedProjectFile?.file_size);
    }
    return formatFileSize(file.file_size);
  };

  return (
    <div className="bg-white shadow rounded-lg space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pt-6 pl-6 pr-6">
        <h3 className="text-base font-semibold text-gray-800">
          Job Input Files ({files.length})
        </h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
          Update
        </button>
      </div>

      {/* Table */}
      <div className="w-full bg-white shadow rounded-lg overflow-hidden">
        <div className="max-h-[200px] overflow-y-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50 text-black-600 text-[11px] tracking-widest border-b">
                {["File #", "Filename", "Size", "Output from job"].map((h) => (
                  <th key={h} className="px-3 py-2 text-center font-bold pl-5 pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500 text-xs">
                    No job input files found.
                  </td>
                </tr>
              ) : (
                files.map((file, index) => (
                  <tr
                    key={file.id || index}
                    className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                  >
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {file.file_code || `#${index + 1}`}
                    </td>
                    <td className="px-3 py-2 text-xs text-center break-words">
                      <button
                        onClick={() => handleDownloadSingle(file)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {getFileName(file)}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {getFileSize(file)}
                    </td>
                    <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                      {file.output_from_job || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LinkedInputFilesCard;