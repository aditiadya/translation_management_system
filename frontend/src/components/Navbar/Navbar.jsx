import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react"; 

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-50">
      <h1 className="text-xl font-bold">MyApp</h1>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Login
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-gray-800 px-2 py-2 rounded-full hover:bg-gray-700"
            >
              <User className="w-5 h-5" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-gray-800">
                
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>

                <button
                  onClick={() => setUser(null)}
                  className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
