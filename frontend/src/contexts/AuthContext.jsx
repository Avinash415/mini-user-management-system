import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      getMe();
    } else {
      setLoading(false);
    }
  }, []);

  const getMe = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`);
      setUser(res.data.user);
    } catch (err) {
      toast.error("Session expired");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      toast.success("Logged in successfully");
      navigate(res.data.user.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, {
        fullName,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      setUser(res.data.user);
      toast.success("Signed up successfully");

      // ✅ ensure state is committed before navigation
      setTimeout(() => {
        navigate("/profile");
      }, 0);
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    toast.info("Logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, getMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
