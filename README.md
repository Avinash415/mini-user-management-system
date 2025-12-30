# Mini User Management System

## Project Overview & Purpose
This is a full-stack web application for managing user accounts with roles (admin/user), authentication, and RBAC. It supports signup, login, profile updates, password changes, and admin functions like viewing/activating/deactivating users. Built for Purple Merit Technologies Backend Developer Intern Assessment.

## Tech Stack Used
- Backend: Node.js + Express
- Database: MongoDB (Atlas)
- Frontend: React (Hooks)
- Authentication: JWT
- Password Hash: bcrypt
- Other: Axios (API calls), react-router-dom, react-toastify, react-confirm-alert
- Testing: Jest + Supertest (backend)
- Deployment: Backend on Render, Frontend on Vercel, DB on MongoDB Atlas

## 📂 Project Structure
root/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── utils/
│ ├── tests/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── context/
│ │ └── App.jsx
│ ├── index.html
│ └── package.json

## Setup Instructions (Frontend & Backend)
1. Clone repo: `git clone <repo-url>`
2. Backend:
   - `cd backend`
   - `npm install`
   - Create `.env` with: PORT=5000, JWT_SECRET=<secret>, DB_URI=<mongodb-uri>
   - `npm run dev` (local)
3. Frontend:
   - `cd frontend`
   - `npm install`
   - Create `.env` with: VITE_API_BASE_URL=http://localhost:5000
   - `npm run dev` (local)

## Environment Variables
- Backend (.env):
  - PORT
  - JWT_SECRET
  - DB_URI
- Frontend (.env):
  - VITE_API_BASE_URL

## Deployment Instructions
- Backend: Pushed to Render (free tier). Set env vars in dashboard. URL: https://your-backend.onrender.com
- Frontend: Pushed to Vercel. Set env var for API. URL: https://your-frontend.vercel.app
- Database: MongoDB Atlas cluster, whitelist IPs in network access.

## API Documentation
Use Postman collection: [Link to shared Postman collection](<postman-link>)

Endpoints:
- POST /api/auth/signup: {fullName, email, password} → token
- POST /api/auth/login: {email, password} → token
- GET /api/auth/me: (auth) → user info
- GET /api/users: (admin) → paginated users
- PUT /api/users/:id/activate: (admin) → activate user
- PUT /api/users/:id/deactivate: (admin) → deactivate user
- PUT /api/users/profile: (auth) {fullName, email} → updated profile
- PUT /api/users/password: (auth) {oldPassword, newPassword} → change password

Example Request (Signup):
