// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/users?page=${currentPage}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error('Fetch users error:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

// In AdminDashboard.jsx
const handleAction = (id, action) => {
  confirmAlert({
    title: 'Confirm Action',
    message: `Are you sure you want to ${action === 'activate' ? 'activate' : 'deactivate'} this user?`,
    overlayClassName: 'custom-confirm-overlay',        // ← Add this
    overlayStyle: { background: 'rgba(0,0,0,0.65)' },  // Optional semi-transparent overlay
    buttons: [
      {
        label: 'Yes',
        onClick: () => performAction(id, action),
        className: action === 'activate' ? 'confirm-yes' : 'confirm-no'
      },
      {
        label: 'No',
        className: 'confirm-cancel'
      }
    ]
  });
};

  const performAction = async (id, action) => {
    try {
      await axios.put(`${API_BASE}/api/users/${id}/${action}`);
      toast.success(`User successfully ${action}d`);
      fetchUsers();
    } catch (err) {
      console.error('Action error:', err);
      toast.error(`Failed to ${action} user`);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p className="subtitle">Manage users • Page {currentPage} of {totalPages}</p>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <p>No users found in the system.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td data-label="Email"className="email-cell">{user.email}</td>
                  <td data-label="Full Name">{user.fullName}</td>
                  <td data-label="Role">
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${user.status}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td data-label="Actions" className="actions-cell">
                    {user.status === 'inactive' ? (
                      <button
                        className="btn btn-activate"
                        onClick={() => handleAction(user._id, 'activate')}
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        className="btn btn-deactivate"
                        onClick={() => handleAction(user._id, 'deactivate')}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination-wrapper">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;