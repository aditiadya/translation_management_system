import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import ProfileInfoCard from "./ProfileInfoCard";
import ChangePasswordSection from "./ChangePasswordSection";

const ProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // holds the full image URL

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [detailsRes, authRes, profileRes, imageRes] = await Promise.all([
          api.get("/admin-details"),
          api.get("/auth/me"),
          api.get("/admin-profile").catch(() => null),
          api.get("/admin-profile/image/meta").catch(() => null), // fetch image metadata
        ]);

        if (detailsRes.data.success && authRes.data) {
          const mergedData = {
            ...detailsRes.data.data,
            email: authRes.data.email,
            ...(profileRes?.data?.success ? profileRes.data.data : {}),
          };
          if (!mergedData.language_email) mergedData.language_email = "English";
          setAdmin(mergedData);
          setFormData(mergedData);
        }

        // Set image URL if exists
        if (imageRes?.data?.success) {
          setProfileImage(imageRes.data.data.image_url);
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
      const { email, gender, teams_id, zoom_id, language_email, ...updateData } = formData;

      const res = await api.put("/admin-details", updateData);

      if (gender || teams_id || zoom_id || language_email) {
        try {
          await api.put("/admin-profile", { gender, teams_id, zoom_id, language_email });
        } catch (err) {
          if (err.response?.status === 404) {
            await api.post("/admin-profile", { gender, teams_id, zoom_id, language_email });
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

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Let the browser set the Content-Type (including boundary)
      const res = await api.post("/admin-profile/image", formData);

      if (res.data.success) {
        setProfileImage(res.data.data.image_url);
      }
    } catch (err) {
      // Surface backend error message when available
      const message = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error("Failed to upload image", message, err);
      // Basic user feedback
      alert(`Image upload failed: ${message}`);
    }
  };

  const handleImageDelete = async () => {
    try {
      const res = await api.delete("/admin-profile/image");
      if (res.data.success) {
        setProfileImage(null);
      }
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  if (!admin)
    return <p className="text-center p-6 bg-gray-100 min-h-screen">Loading...</p>;

  return (
    <>
      <ProfileInfoCard
        admin={admin}
        isEditing={isEditing}
        formData={formData}
        setIsEditing={setIsEditing}
        setFormData={setFormData}
        handleChange={handleChange}
        handleSave={handleSave}
        profileImage={profileImage}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />
      <ChangePasswordSection />
    </>
  );
};

export default ProfilePage;