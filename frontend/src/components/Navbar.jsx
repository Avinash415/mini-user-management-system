// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand - Left */}
        <Link to="/" className="brand-link" onClick={closeMenu}>
          PurpleMerit
        </Link>

        {/* Welcome + Role - Visible on desktop/tablet only */}
        <div className="welcome-desktop">
          <span className="welcome-text">
            Welcome, <strong>{user.fullName}</strong>
          </span>
          <span className={`role-badge ${user.role.toLowerCase()}`}>
            {user.role}
          </span>
        </div>

        {/* Hamburger - Mobile only */}
        <button 
          className="hamburger-btn" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger-icon"></span>
        </button>

        {/* Menu Dropdown */}
        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          {/* Welcome + Role - Only visible inside menu on mobile */}
          <div className="welcome-mobile">
            <span className="welcome-text">
              Welcome, <strong>{user.fullName}</strong>
            </span>
            <span className={`role-badge ${user.role.toLowerCase()}`}>
              {user.role}
            </span>
          </div>

          {/* Menu Items */}
          {user.role === 'admin' && (
            <Link to="/admin" className="nav-item" onClick={closeMenu}>
              Admin Dashboard
            </Link>
          )}
          <Link to="/profile" className="nav-item" onClick={closeMenu}>
            Profile
          </Link>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;