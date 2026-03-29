import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar"; // Still needed for the public view
import MainLayout from "../../components/Sidebar/MainLayout";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  // If user is logged in, render with MainLayout and show dashboard
  if (user) {
    return (
      <MainLayout>
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600">
            This is your protected area. The sidebar state is now global!
          </p>
        </div>
      </MainLayout>
    );
  }

  // Public View (Landing Page)
  return (
    <>
      <Navbar />
      <div className="h-[90vh] flex justify-center items-center gap-8 bg-gradient-to-br from-white to-gray-100">
        <Button onClick={() => navigate("/create-account")}>
          Create an Account
        </Button>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    </>
  );
};

export default HomePage;