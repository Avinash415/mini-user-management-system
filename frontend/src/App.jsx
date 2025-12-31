// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import ProtectedRoute from "./utils/ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {

  // 🔥 Backend warm-up ping (cold start fix)
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/health`)
      .catch(() => {
        // intentionally ignored – backend may be sleeping
      });
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<UserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default App;
