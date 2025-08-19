import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import LogoutButton from "../Button/LogoutButton";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">MyApp</h1>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Login
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <span>Hello, {user.email}</span>
            <LogoutButton onLogout={() => setUser(null)} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
