// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
// ... other imports

const App = () => {
  return (
    <Routes>
      
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected user routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/" element={<UserProfile />} /> {/* or home */}
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