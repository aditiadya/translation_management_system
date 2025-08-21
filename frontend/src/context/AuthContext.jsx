import React, { createContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me", { withCredentials: true })
      .then((res) => {
        console.log("AuthContext /auth/me response:", res.data);
        setUser(res.data);
      })
      .catch(err  => {
        console.error("AuthContext /auth/me error:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
