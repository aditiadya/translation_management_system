import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import DocumentsTable from "./DocumentsTable";
import DocumentUpload from "./DocumentUpload";
import { FaPlus, FaLink } from "react-icons/fa";

const DocumentsPage = ({ vendorId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/vendor-documents?vendor_id=${vendorId}`, {
        withCredentials: true,
      });
      setDocuments(res.data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [vendorId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/vendor-documents/${id}`, { withCredentials: true });
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document");
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchDocuments();
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-gray-700">Vendor Documents</h1>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            <FaPlus className="mr-2" /> Upload Document
          </button>

          <button
            onClick={() => alert('Add URL feature coming soon!')}
            className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            <FaLink className="mr-2" /> Add URL
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No documents found.</div>
        ) : (
          <DocumentsTable documents={documents} onDelete={handleDelete} />
        )}
      </div>

      {showUploadModal && (
        <DocumentUpload
          vendorId={vendorId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </main>
  );
};

export default DocumentsPage;