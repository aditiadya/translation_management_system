import { useEffect, useState } from "react";
import api from "../../../../utils/axiosInstance";
import DocumentsTable from "./DocumentsTable";

const DocumentsPage = ({ vendorId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`/vendors/${vendorId}/documents`, {
          withCredentials: true,
        });
        setDocuments(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vendor documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [vendorId]);

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`/vendors/${vendorId}/documents/${docId}`, {
        withCredentials: true,
      });
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      alert("Document deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-6">Loading documents...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-6 font-medium">{error}</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Vendor Documents</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => alert("Add document form will open")}
        >
          Upload
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => alert("Add document form will open")}
        >
          Add URLs
        </button>
      </div>

      <DocumentsTable documents={documents} onDelete={handleDelete} />
    </div>
  );
};

export default DocumentsPage;