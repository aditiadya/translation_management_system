import { createContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Log when setUser is called
  const setUserWithLogging = (userData) => {
    console.log("🔵 AuthContext: setUser called with:", userData);
    setUser(userData);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        console.log("✅ AuthContext: Initial auth check successful:", data);
        setUser(data.user || data);
      } catch (err) {
        console.warn("⚠️ AuthContext: Auth check failed:", err?.response?.status);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser: setUserWithLogging, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
