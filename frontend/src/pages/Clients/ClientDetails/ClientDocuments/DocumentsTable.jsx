import { FaTrash } from "react-icons/fa";

const DocumentsTable = ({ documents, onDelete }) => {
  const formatSize = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b text-left">File Name</th>
            <th className="py-3 px-4 border-b">Size</th>
            <th className="py-3 px-4 border-b">Uploaded At</th>
            <th className="py-3 px-4 border-b">Uploaded By</th>
            <th className="py-3 px-4 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b text-center">{doc.id}</td>
              <td className="py-3 px-4 border-b">{doc.document_name}</td>
              <td className="py-3 px-4 border-b text-center">
                {formatSize(doc.file_size)}
              </td>
              <td className="py-3 px-4 border-b text-center">
                {formatDate(doc.uploaded_at)}
              </td>
              <td className="py-3 px-4 border-b text-center">
                {doc.uploaded_by}
              </td>
              <td className="py-3 px-4 border-b text-center">
                <button
                  onClick={() => onDelete(doc.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentsTable;