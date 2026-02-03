import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../../../../utils/axiosInstance";

const UploadFilePage = ({ projectId, onClose, onSuccess }) => {
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      alert("Invalid file type. Allowed: PNG, JPG, PDF, DOC, DOCX");
      e.target.value = "";
      return;
    }

    setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("project_id", projectId);   // ✅ required
    formData.append("category", category || ""); 
    formData.append("note", note || "");
    formData.append("file", file);              // ✅ actual file

    try {
      setUploading(true);

      await api.post("/project-input-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      onSuccess();
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error?.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
        
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload File
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <FaTimes className="text-gray-500 text-lg" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Optional category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="3"
              placeholder="Optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
              onChange={handleFileChange}
              required
              className="block w-full border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported: PNG, JPG, PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className={`px-5 py-2 rounded-md text-white ${
                uploading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFilePage;