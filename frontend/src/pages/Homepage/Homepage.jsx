import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar"; // Still needed for the public view
import MainLayout from "../../components/Sidebar/MainLayout";
import Dashboard from "../Dashboard/Dashboard";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  // If user is logged in, render with MainLayout and show role-based dashboard
  if (user) {
    return (
      <MainLayout>
        <Dashboard />
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