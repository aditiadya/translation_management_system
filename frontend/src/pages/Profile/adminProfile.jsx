import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProfileInfoCard from "./ProfileInfoCard";
import ChangePasswordSection from "./ChangePasswordSection";

const ProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [detailsRes, authRes, profileRes] = await Promise.all([
          api.get("/admin-details"),
          api.get("/auth/me"),
          api.get("/admin-profile").catch(() => null),
        ]);

        if (detailsRes.data.success && authRes.data) {
          const mergedData = {
            ...detailsRes.data.data,
            email: authRes.data.email,
            ...(profileRes?.data?.success ? profileRes.data.data : {}),
          };
          setAdmin(mergedData);
          setFormData(mergedData);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const { email, gender, teams_id, zoom_id, language_email, ...updateData } =
        formData;

      const res = await api.put("/admin-details", updateData);

      if (gender || teams_id || zoom_id || language_email) {
        try {
          await api.put("/admin-profile", {
            gender,
            teams_id,
            zoom_id,
            language_email,
          });
        } catch (err) {
          if (err.response?.status === 404) {
            await api.post("/admin-profile", {
              gender,
              teams_id,
              zoom_id,
              language_email,
            });
          } else throw err;
        }
      }

      if (res.data.success) {
        setAdmin(formData);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (!admin)
    return (
      <p className="text-center p-6 bg-gray-100 min-h-screen">Loading...</p>
    );

  return (
    <>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        className={`transition-all duration-300 bg-gray-50 min-h-screen p-8
          ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        <ProfileInfoCard
          admin={admin}
          isEditing={isEditing}
          formData={formData}
          setIsEditing={setIsEditing}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSave={handleSave}
        />
        <ChangePasswordSection />
      </main>
    </>
  );
};

export default ProfilePage;
