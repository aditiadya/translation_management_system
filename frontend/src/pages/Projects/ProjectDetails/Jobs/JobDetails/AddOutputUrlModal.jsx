import { useState } from "react";
import { X, Link as LinkIcon } from "lucide-react";

const AddOutputUrlModal = ({ jobId, onClose, onSuccess }) => {
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    if (!fileName.trim()) {
      alert("Please enter a file name");
      return;
    }

    try {
      setAdding(true);
      // TODO: Implement URL addition logic
      // This would require a backend endpoint to download from URL and store
      alert("URL feature coming soon!");
      onClose();
    } catch (error) {
      console.error("Add URL error:", error);
      alert("Failed to add URL");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add File from URL</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* File Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="e.g., output.pdf"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File URL <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="https://example.com/file.pdf"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the direct URL to download the file
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={adding || !url.trim() || !fileName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            {adding ? "Adding..." : "Add URL"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOutputUrlModal;