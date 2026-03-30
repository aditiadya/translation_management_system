import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import VendorDashboard from "./VendorDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (user?.roleSlug === "vendor") return <VendorDashboard />;
  return <AdminDashboard />;
};

export default Dashboard;