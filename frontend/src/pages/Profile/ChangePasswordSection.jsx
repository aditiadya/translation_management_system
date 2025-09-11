import { FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ChangePasswordSection = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/change-password");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      <button
        onClick={handleClick}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
      >
        <FiLock size={18} />
        <span>Change Password</span>
      </button>
    </div>
  );
};

export default ChangePasswordSection;
