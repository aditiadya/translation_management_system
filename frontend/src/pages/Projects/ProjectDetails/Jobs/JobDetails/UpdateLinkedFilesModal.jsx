import { useState, useEffect } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import api from "../../../../../utils/axiosInstance";

const UpdateLinkedFilesModal = ({ jobId, existingFiles = [], onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("link");
  const [uploading, setUploading] = useState(false);
  const [linking, setLinking] = useState(false);

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("");

  // Link state
  const [projectFiles, setProjectFiles] = useState([]);
  const [selectedProjectFiles, setSelectedProjectFiles] = useState([]);
  const [loadingProjectFiles, setLoadingProjectFiles] = useState(false);
  const [projectId, setProjectId] = useState(null);

  // Fetch job details to get project_id
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`/jobs/${jobId}`, { withCredentials: true });
        setProjectId(response.data.data.project_id);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  // Fetch project input files and pre-select linked ones
  useEffect(() => {
    if (projectId) {
      fetchProjectFiles();
    }
  }, [projectId]);

  const fetchProjectFiles = async () => {
    try {
      setLoadingProjectFiles(true);
      const response = await api.get(
        `/project-input-files?project_id=${projectId}`,
        { withCredentials: true }
      );
      const allProjectFiles = response.data.data || [];
      setProjectFiles(allProjectFiles);

      // Pre-select files that are already linked to this job
      const linkedFileIds = existingFiles
        .filter((f) => f.is_linked && f.project_input_file_id)
        .map((f) => f.project_input_file_id);
      setSelectedProjectFiles(linkedFileIds);
    } catch (error) {
      console.error("Failed to fetch project files:", error);
      alert("Failed to load project files");
    } finally {
      setLoadingProjectFiles(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("job_id", jobId);
      formData.append("category", uploadCategory);

      await api.post("/job-input-files", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully");
      onSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateLinks = async () => {
    try {
      setLinking(true);

      // Get currently linked file IDs
      const currentlyLinkedIds = existingFiles
        .filter((f) => f.is_linked && f.project_input_file_id)
        .map((f) => f.project_input_file_id);

      // Files to link (newly selected)
      const toLink = selectedProjectFiles.filter((id) => !currentlyLinkedIds.includes(id));

      // Files to unlink (deselected)
      const toUnlink = currentlyLinkedIds.filter((id) => !selectedProjectFiles.includes(id));

      // Link new files
      for (const fileId of toLink) {
        await api.post(
          "/job-input-files/link",
          { job_id: jobId, project_input_file_id: fileId },
          { withCredentials: true }
        );
      }

      // Unlink removed files
      for (const fileId of toUnlink) {
        const jobInputFile = existingFiles.find((f) => f.project_input_file_id === fileId);
        if (jobInputFile) {
          await api.delete(`/job-input-files/${jobInputFile.id}`, { withCredentials: true });
        }
      }

      alert("Files updated successfully");
      onSuccess();
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update files");
    } finally {
      setLinking(false);
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedProjectFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Update Job Input Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === "link"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LinkIcon className="w-4 h-4 inline mr-2" />
            Link from Project Files
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === "upload"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload New File
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "upload" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g., Source Document"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Select Project Files to Link
                  {selectedProjectFiles.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({selectedProjectFiles.length} selected)
                    </span>
                  )}
                </h3>

                {loadingProjectFiles ? (
                  <p className="text-center text-gray-500 py-4">Loading project files...</p>
                ) : projectFiles.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No project files available</p>
                ) : (
                  <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr className="text-xs text-gray-700">
                          <th className="px-4 py-2 text-left w-12">
                            <input
                              type="checkbox"
                              checked={
                                projectFiles.length > 0 &&
                                selectedProjectFiles.length === projectFiles.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProjectFiles(projectFiles.map((f) => f.id));
                                } else {
                                  setSelectedProjectFiles([]);
                                }
                              }}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </th>
                          <th className="px-4 py-2 text-left">Code</th>
                          <th className="px-4 py-2 text-left">Filename</th>
                          <th className="px-4 py-2 text-left">Size</th>
                          <th className="px-4 py-2 text-left">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectFiles.map((file, index) => {
                          const isSelected = selectedProjectFiles.includes(file.id);
                          return (
                            <tr
                              key={file.id}
                              onClick={() => toggleFileSelection(file.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-blue-50 hover:bg-blue-100"
                                  : index % 2 === 0
                                  ? "bg-white hover:bg-gray-50"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                            >
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleFileSelection(file.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-2 text-xs">{file.file_code}</td>
                              <td className="px-4 py-2 text-xs">{file.original_file_name}</td>
                              <td className="px-4 py-2 text-xs">{formatFileSize(file.file_size)}</td>
                              <td className="px-4 py-2 text-xs">{file.category || "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          {activeTab === "upload" ? (
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          ) : (
            <button
              onClick={handleUpdateLinks}
              disabled={linking}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {linking ? "Updating..." : "Update Links"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateLinkedFilesModal;