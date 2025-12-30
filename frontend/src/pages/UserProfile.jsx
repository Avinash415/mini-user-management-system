// src/pages/UserProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import './UserProfile.css';

const UserProfile = () => {
  const { user, loading, getMe } = useContext(AuthContext);
  
  const [editMode, setEditMode] = useState(false);
const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 3) newErrors.fullName = 'Minimum 3 characters';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.oldPassword) newErrors.oldPassword = 'Old password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Minimum 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, formData);
      toast.success('Profile updated successfully');
      getMe();
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/password`, passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading || !user) return <Spinner />;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
          <p className="profile-subtitle">Manage your personal information</p>
        </div>

        {!editMode ? (
          <div className="profile-view">
            <div className="profile-info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user.fullName}</span>
            </div>

            <div className="profile-info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>

            <button 
              className="btn btn-edit" 
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={updateProfile} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleProfileChange}
                className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="password-section">
          <h3>Change Password</h3>
          <form onSubmit={changePassword} className="password-form">
            <div className="form-group">
              <label htmlFor="oldPassword">Current Password</label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={`form-input ${errors.oldPassword ? 'input-error' : ''}`}
                placeholder="Enter current password"
              />
              {errors.oldPassword && <span className="error-text">{errors.oldPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                placeholder="Enter new password (min 8 chars)"
              />
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;