import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/axiosInstance";
import ManagerView from "./ManagerView";
import ManagerEditForm from "./ManagerEditForm";

const ManagerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchManager = async () => {
    try {
      const response = await api.get(`/managers/${id}`, {
        withCredentials: true,
      });
      setManager(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch manager details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManager();
  }, [id]);

  

  const handleDelete = async () => {

    try {
      await api.delete(`/managers/${id}`, { withCredentials: true });
      navigate("/managers");
    } catch (err) {
      console.error(err);
      alert("Failed to delete manager");
    }
  };

  const handleResendInvitation = async () => {
    try {
      await api.post(
        `/managers/${id}/resend-invitation`,
        {},
        { withCredentials: true }
      );
      alert("Invitation resent successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to resend invitation");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-medium">{error}</div>
    );

  return (
    <>
        {!isEditing ? (
          <ManagerView
            manager={manager}
            onEdit={() => setIsEditing(true)}
            onResendInvitation={handleResendInvitation}
            onDelete={handleDelete}
          />
        ) : (
          <ManagerEditForm
            manager={manager}
            id={id}
            navigate={navigate}
            setIsEditing={setIsEditing}
            refreshManager={fetchManager}
          />
        )}
    </>
  );
};

export default ManagerDetailPage;