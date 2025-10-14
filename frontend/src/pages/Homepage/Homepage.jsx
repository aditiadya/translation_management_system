import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import styles from "./Homepage.module.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  if (user) {
    return (
      <>
        <Navbar />
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main
          className={`transition-all duration-300 bg-gray-50 min-h-screen p-8 flex-1 ${
            isSidebarOpen ? "md:ml-64" : "md:ml-20"
          }`}
        >
          <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              This is your protected area. Enjoy your stay!
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Button onClick={() => navigate("/create-account")}>
          Create an Account
        </Button>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    </>
  );
};

export default HomePage;