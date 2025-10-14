import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

const BackButton = ({ to, onClick, className, style }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } 
    else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`flex items-center gap-1 p-1 rounded transition-shadow duration-200 hover:shadow-md ${className || ""}`}
      style={style}
    >
      <HiArrowLeft size={18} />
    </button>
  );
};

export default BackButton;