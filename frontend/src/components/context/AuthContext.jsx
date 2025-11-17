import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decoded = decodeToken(storedToken);
      if (decoded && decoded.role) {
        setUserRole(decoded.role);
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (tokenValue) => {
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    const decoded = decodeToken(tokenValue);
    if (decoded && decoded.role) {
      setUserRole(decoded.role);
    }
  };

  const logout = () => {
    setToken("");
    setUserRole(null);
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!token;
  const isAdmin = userRole === "admin";

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn, userRole, isAdmin, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};
