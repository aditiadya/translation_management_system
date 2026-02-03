import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import FilesTable from "./FilesTable";
import UploadFilePage from "./UploadFilePage";
import { FaPlus, FaLink } from "react-icons/fa";
import BackButton from "../../../../components/Button/BackButton";

const FilesPage = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchFiles = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const res = await api.get(
        `/project-input-files?project_id=${projectId}`,
        { withCredentials: true }
      );

      setFiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await api.delete(`/project-input-files/${id}`, {
        withCredentials: true,
      });

      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete file");
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchFiles();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <BackButton to="/projects" />
          <h2 className="text-2xl font-bold text-gray-900">Project Input Files</h2>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            <FaPlus className="mr-2" /> Upload File
          </button>

          <button
            onClick={() => alert("Add URL feature coming soon!")}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            <FaLink className="mr-2" /> Add URL
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        {loading ? (
          <div className="text-center text-gray-500 py-6">
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No files found.
          </div>
        ) : (
          <FilesTable files={files} onDelete={handleDelete} />
        )}
      </div>

      {showUploadModal && (
        <UploadFilePage
          projectId={projectId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default FilesPage;