import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import DocumentsTable from "./DocumentsTable";
import DocumentUpload from "./DocumentUpload";
import ConfirmModal from "../../../../components/Modals/ConfirmModal";
import { FaPlus, FaLink } from "react-icons/fa";

const DocumentsPage = ({ clientId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, docId: null, docName: "" });

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/client-documents?client_id=${clientId}`, {
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
  }, [clientId]);

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ show: true, docId: id, docName: name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/client-documents/${deleteModal.docId}`, { withCredentials: true });
      setDocuments((prev) => prev.filter((doc) => doc.id !== deleteModal.docId));
      setDeleteModal({ show: false, docId: null, docName: "" });
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete document");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, docId: null, docName: "" });
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchDocuments();
  };

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-gray-700">
          Client Documents
        </h1>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded shadow"
          >
            <FaPlus className="mr-2" /> Upload Document
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
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No documents found.
          </div>
        ) : (
          <DocumentsTable documents={documents} onDelete={handleDeleteClick} />
        )}
      </div>

      {showUploadModal && (
        <DocumentUpload
          clientId={clientId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {deleteModal.show && (
        <ConfirmModal
          title="Delete Document"
          message={`Are you sure you want to delete "${deleteModal.docName}"? This action cannot be undone.`}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          confirmText="Delete"
          confirmColor="bg-red-600"
          confirmHoverColor="hover:bg-red-700"
        />
      )}
    </main>
  );
};

export default DocumentsPage;
