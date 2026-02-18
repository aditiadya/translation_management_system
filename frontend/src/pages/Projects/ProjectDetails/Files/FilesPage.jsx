import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../utils/axiosInstance";
import ProjectInputFilesCard from "./ProjectInputFilesCard";
import UploadFilePage from "./UploadFilePage";
import BackButton from "../../../../components/Button/BackButton";
import LinkedInputFilesCard from "./JobLinkedInputFilesCard";
import OutputFilesCard from "./JobOutputFilesCard";
import ProjectOutputFilesCard from "./ProjectOutputFilesCard";

const FilesPage = () => {
  const { id: projectId } = useParams();

  const [projectInputFiles, setProjectInputFiles] = useState([]);
  const [jobInputFiles, setJobInputFiles] = useState([]);
  const [jobOutputFiles, setJobOutputFiles] = useState([]);
  const [projectOutputFiles, setProjectOutputFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchProjectInputFiles = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await api.get(`/project-input-files?project_id=${projectId}`, { withCredentials: true });
      setProjectInputFiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching project input files:", error);
      alert("Failed to fetch project input files");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobInputFiles = async () => {
    if (!projectId) return;
    try {
      const res = await api.get(`/job-input-files?project_id=${projectId}`, { withCredentials: true });
      setJobInputFiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching job input files:", error);
    }
  };

  const fetchJobOutputFiles = async () => {
    if (!projectId) return;
    try {
      const res = await api.get(`/job-output-files?project_id=${projectId}`, { withCredentials: true });
      setJobOutputFiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching job output files:", error);
    }
  };

  const fetchProjectOutputFiles = async () => {
    if (!projectId) return;
    try {
      const res = await api.get(`/project-output-files?project_id=${projectId}`, { withCredentials: true });
      setProjectOutputFiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching project output files:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectInputFiles();
      fetchJobInputFiles();
      fetchJobOutputFiles();
      fetchProjectOutputFiles();
    }
  }, [projectId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/project-input-files/${id}`, { withCredentials: true });
      setProjectInputFiles((prev) => prev.filter((f) => f.id !== id));
      await fetchJobInputFiles();
      alert("File deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to delete file");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BackButton to={`/project/${projectId}`} />
          <h2 className="text-2xl font-bold text-gray-900">Project Files</h2>
        </div>
      </div>

      {/* Project Input Files */}
      <ProjectInputFilesCard
        files={projectInputFiles}
        loading={loading}
        onDelete={handleDelete}
        onUpload={() => setShowUploadModal(true)}
      />

      {/* Job Files Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <LinkedInputFilesCard
            projectId={projectId}
            files={jobInputFiles}
          />
        </div>
        <div className="lg:col-span-7">
          <OutputFilesCard
            projectId={projectId}
            files={jobOutputFiles}
            onRefresh={() => {
              fetchJobOutputFiles();
              fetchProjectOutputFiles();
            }}
          />
        </div>
      </div>

      {/* Project Output Files */}
      <div className="w-full">
        <ProjectOutputFilesCard
          projectId={projectId}
          files={projectOutputFiles}
          onRefresh={fetchProjectOutputFiles}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadFilePage
          projectId={projectId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchProjectInputFiles();
          }}
        />
      )}
    </div>
  );
};

export default FilesPage;