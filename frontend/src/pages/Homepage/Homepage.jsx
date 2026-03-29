import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar";
import MainLayout from "../../components/Sidebar/MainLayout";
import VendorMainLayout from "../../components/Sidebar/VendorMainLayout";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    console.log("🟡 HomePage: Still loading...");
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  // If user is logged in, render appropriate dashboard based on role
  if (user) {
    // Enhanced debug logging
    console.log("=== HomePage Debug Info ===");
    console.log("✅ User detected in HomePage");
    console.log("Current user data:", user);
    console.log("User roleSlug:", user?.roleSlug);
    console.log("User role:", user?.role);
    console.log("User ID:", user?.id);
    
    // Check if user is a vendor - more robust check
    const isVendor = user?.roleSlug === "vendor" || user?.role === "Vendor";
    console.log("Is vendor (isVendor):", isVendor);
    
    if (isVendor) {
      console.log("✅ VENDOR DETECTED - Rendering VendorMainLayout");
      console.log("=== End Debug ===");
      return (
        <VendorMainLayout>
          <VendorDashboard />
        </VendorMainLayout>
      );
    }

    // Default to admin/administrator dashboard
    console.log("❌ NOT VENDOR - Rendering MainLayout (Admin)");
    console.log("=== End Debug ===");
    return (
      <MainLayout>
        <AdminDashboard />
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