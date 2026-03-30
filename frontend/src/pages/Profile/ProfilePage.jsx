import { useContext, useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import ProfileInfoCard from "./ProfileInfoCard";
import ChangePasswordSection from "./ChangePasswordSection";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // holds the full image URL

  const isVendor = user?.roleSlug === "vendor";
  const detailsEndpoint = isVendor ? "/vendor-self" : "/admin-details";
  const profileEndpoint = isVendor ? "/vendor-profile" : "/admin-profile";
  const profileImageMetaEndpoint = `${profileEndpoint}/image/meta`;

  const mapVendorDataToForm = (details) => {
    if (!details) return details;

    const primary = details.primary_users || {};
    const timezone = primary.timezone || details.timezone || details.time_zone || "";

    return {
      ...details,
      first_name: primary.first_name || details.first_name || "",
      last_name: primary.last_name || details.last_name || "",
      phone: primary.phone || details.phone || "",
      gender: primary.gender || details.gender || "",
      nationality: primary.nationality || details.nationality || "",
      teams_id: primary.teams_id || details.teams_id || "",
      zoom_id: primary.zoom_id || details.zoom_id || "",
      time_zone: timezone,
      username: details.username || details.auth?.email || details.email || "",
      email: details.auth?.email || details.email || "",
    };
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [detailsRes, authRes, profileRes, imageRes] = await Promise.all([
          api.get(detailsEndpoint),
          api.get("/auth/me"),
          api.get(profileEndpoint).catch(() => null),
          api.get(profileImageMetaEndpoint).catch(() => null),
        ]);

        if (detailsRes.data.success && authRes.data) {
          let baseData = detailsRes.data.data;

          if (isVendor) {
            baseData = mapVendorDataToForm(baseData);
          }

          const mergedData = {
            ...baseData,
            email: authRes.data.email,
            ...(profileRes?.data?.success ? profileRes.data.data : {}),
          };

          if (!mergedData.language_email) mergedData.language_email = "English";
          setAdmin(mergedData);
          setFormData(mergedData);
        }

        if (imageRes?.data?.success) {
          setProfileImage(imageRes.data.data.image_url);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [detailsEndpoint, profileEndpoint, profileImageMetaEndpoint, isVendor]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const { email, gender, teams_id, zoom_id, language_email, ...updateData } = formData;

      const res = await api.put(detailsEndpoint, updateData);

      if (gender || teams_id || zoom_id || language_email) {
        try {
          await api.put(profileEndpoint, { gender, teams_id, zoom_id, language_email });
        } catch (err) {
          if (err.response?.status === 404) {
            await api.post(profileEndpoint, { gender, teams_id, zoom_id, language_email });
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

      const res = await api.post(`${profileEndpoint}/image`, formData);

      if (res.data.success) {
        setProfileImage(res.data.data.image_url);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error("Failed to upload image", message, err);
      alert(`Image upload failed: ${message}`);
    }
  };

  const handleImageDelete = async () => {
    try {
      const res = await api.delete(`${profileEndpoint}/image`);
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