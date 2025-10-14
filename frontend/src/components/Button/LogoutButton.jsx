import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await api.post("auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
    >
       Logout {" "}
    </button>
  );
};

export default LogoutButton;
