import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/axiosInstance";
import ProjectDetailsCard from "./ProjectDetailsCard";
import ManagerStatusCard from "./ManagerStatusCard";
import MessageCard from "./MessageCard";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`, {
        withCredentials: true,
      });
      setProject(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleEdit = () => {
    navigate(`/project/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${id}`, { withCredentials: true });
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );
  }

  if (!project) {
    return (
      <div className="text-center mt-10 text-gray-500">Project not found.</div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <ProjectDetailsCard
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="lg:w-[500px]">
          <ManagerStatusCard project={project} />
        </div>
      </div>
      <div className="mt-5">
      <MessageCard/>
      </div>
    </div>
  );
};

export default DetailsPage;