import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import LogoutConfirmModal from "../Modals/LogoutConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [user, setUser] = useState(null); // from /auth/me
  const [profile, setProfile] = useState(null); // from /admin-details
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        return api.get("/admin-details");
      })
      .then((res) => {
        setProfile(res.data?.data || res.data);
      })
      .catch(() => {
        setUser(null);
        setProfile(null);
      });
  }, []);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    setUser(null);
    setProfile(null);
    setShowLogoutConfirm(false);
    setOpen(false);
  };

  const handleMenuClick = (callback) => {
    setOpen(false);
    if (callback) callback();
  };

  // Avatar (fallback to initials if no image)
  const getAvatar = () => {
    if (profile?.avatarUrl) {
      return (
        <img
          src={profile.avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-600"
        />
      );
    }
    const initial = profile?.username?.[0]?.toUpperCase() || "U";
    return (
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
        {initial}
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 bg-gray-900 text-white px-6 py-3 flex justify-between items-center  z-50">
        {/* Left Section: Logo/Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            M
          </div>
          <h1 className="text-xl font-bold group-hover:text-blue-400 transition">
            MyApp
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition"
              >
                Login
              </Link>
              <Link
                to="/create-account"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg shadow-md transition border border-gray-500"
              >
                Create an Account
              </Link>
            </>
            
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 transition"
              >
                {getAvatar()}
                <span className="hidden sm:inline font-medium">
                  {profile?.username}
                </span>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg overflow-hidden text-gray-800"
                  >
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="font-semibold">{profile?.username}</p>
                      <p className="text-sm text-gray-500">
                        {user?.email || "Admin"}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => handleMenuClick()}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 transition"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    <button
                      onClick={() =>
                        handleMenuClick(() => setShowLogoutConfirm(true))
                      }
                      className="flex items-center gap-2 px-4 py-3 text-sm w-full text-left hover:bg-gray-100 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onCancel={() => setShowLogoutConfirm(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Navbar;
