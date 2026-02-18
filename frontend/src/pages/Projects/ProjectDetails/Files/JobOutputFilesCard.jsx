import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import api from "../../../../utils/axiosInstance";

// ── Selection Modal ──────────────────────────────────────────────────────────

const AddToProjectOutputModal = ({ files, onClose, onConfirm }) => {
  const [selected, setSelected] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Only show files not yet added
  const eligibleFiles = files.filter((f) => !f.is_project_output);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === eligibleFiles.length) {
      setSelected([]);
    } else {
      setSelected(eligibleFiles.map((f) => f.id));
    }
  };

  const handleConfirm = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);
    await onConfirm(selected);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-800">
            Select Files to Add to Project Output
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {eligibleFiles.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              All files have already been added to project output.
            </p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs text-gray-600">
                  <th className="px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selected.length === eligibleFiles.length && eligibleFiles.length > 0}
                      onChange={toggleAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">File #</th>
                  <th className="px-3 py-2 text-left font-semibold">Filename</th>
                  <th className="px-3 py-2 text-left font-semibold">Size</th>
                  <th className="px-3 py-2 text-left font-semibold">Job</th>
                </tr>
              </thead>
              <tbody>
                {eligibleFiles.map((file, index) => {
                  const isChecked = selected.includes(file.id);
                  const kb = (file.file_size || 0) / 1024;
                  const size = kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;

                  return (
                    <tr
                      key={file.id}
                      onClick={() => toggleSelect(file.id)}
                      className={`cursor-pointer border-b transition ${
                        isChecked
                          ? "bg-blue-50"
                          : index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(file.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {file.file_code || `#${index + 1}`}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-800 break-words">
                        {file.original_file_name || "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {file.file_size ? size : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {file.job?.name || `Job #${file.job_id}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between gap-3">
          <span className="text-xs text-gray-500">
            {selected.length} file{selected.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0 || submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              <Check className="w-4 h-4" />
              {submitting ? "Adding..." : "Add to Project Output"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Card ────────────────────────────────────────────────────────────────

const OutputFilesCard = ({ projectId, files = [], onRefresh }) => {
  const [showModal, setShowModal] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const hasFiles = files.length > 0;
  const allAdded = hasFiles && files.every((f) => f.is_project_output);

  const handleConfirmAdd = async (selectedIds) => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          api.post(`/job-output-files/${id}/add-to-project`, {}, { withCredentials: true })
        )
      );
      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error("Add to project output error:", error);
      alert(error.response?.data?.message || "Failed to add files to project output");
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center pt-6 pl-6 pr-6">
          <h3 className="text-base font-semibold text-gray-800">
            Job Output Files ({files.length})
          </h3>

          <button
            onClick={() => setShowModal(true)}
            disabled={!hasFiles || allAdded}
            title={
              !hasFiles
                ? "No job output files available"
                : allAdded
                ? "All files already added to project output"
                : "Select files to add to project output"
            }
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Add to Project Output
          </button>
        </div>

        {/* Table */}
        <div className="w-full bg-white shadow rounded-lg overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-[11px] tracking-widest border-b">
                  {["File #", "Filename", "Size", "Input for Jobs", "Project Output"].map((h) => (
                    <th key={h} className="px-3 py-2 text-center font-bold pl-5 pr-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500 text-xs">
                      No job output files found.
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
                        {file.original_file_name || "—"}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {formatFileSize(file.file_size)}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.input_for_job || "—"}
                      </td>

                      <td className="px-3 py-2 text-xs text-center whitespace-nowrap">
                        {file.is_project_output ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            ✓ Added
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-400 px-2 py-1 rounded text-xs font-medium">
                            Not added
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <AddToProjectOutputModal
          files={files}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmAdd}
        />
      )}
    </>
  );
};

export default OutputFilesCard;