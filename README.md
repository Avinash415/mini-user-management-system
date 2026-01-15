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
    ├── .github
    ├── backend/
    │   ├── src/
    │ │ ├── config/
    │ │ ├── controllers/
    │ │ ├── middleware/
    │ │ ├── models/
    │ │ ├── routes/
    │ │ └── utils/
    │ ├── _tests_
    │ ├── server.js
    | ├── Dockerfile
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
Use Postman collection: [https://web.postman.co/workspace/My-Workspace~5ee8e30d-10aa-40bc-876d-2852a60386d0/collection/37267683-64a75fc6-b788-4674-89d7-23cccf2fede8?action=share&source=copy-link&creator=37267683]

Endpoints:
- POST /api/auth/signup: {fullName, email, password} → token
- POST /api/auth/login: {email, password} → token
- GET /api/auth/me: (auth) → user info
- GET /api/users: (admin) → paginated users
- PUT /api/users/:id/activate: (admin) → activate user
- PUT /api/users/:id/deactivate: (admin) → deactivate user
- PUT /api/users/profile: (auth) {fullName, email} → updated profile
- PUT /api/users/password: (auth) {oldPassword, newPassword} → change password
  

 ## 🔐 Admin Account Handling & Security Design

For security reasons, admin accounts cannot be created via the public signup API.

The signup endpoint strictly allows only normal users (`role: user`).  
Any attempt to pass the `role` field during signup is intentionally rejected to prevent unauthorized privilege escalation.

### Admin Account Creation
- Admin users are **pre-created (seeded)** directly in the database.
- This simulates real-world production systems where admin access is tightly controlled.
- Public APIs never allow role assignment.

### Demo Admin Credentials
For demonstration and evaluation purposes, a default admin account has been seeded:

- **Email:** bablu@gmail.com  
- **Password:** 123456789  

> ⚠️ Note: In a production environment, admin users would be created via secure internal workflows or database seed scripts, not exposed public APIs.

This approach ensures proper Role-Based Access Control (RBAC) and follows industry security best practices.


## Authentication Routes :
    | Method | Endpoint         | Description       |
    | ------ | ---------------- | ----------------- |
    | POST   | /api/auth/signup | User registration |
    | POST   | /api/auth/login  | User login        |
    | GET    | /api/auth/me     | Get current user  |
    | POST   | /api/auth/logout | User logout       |

## Admin Routes :
    | Method | Endpoint                        | Description               |
    | ------ | ------------------------------- | ------------------------- |
    | GET    | /api/admin/users                | Get all users (paginated) |
    | PATCH  | /api/admin/users/:id/activate   | Activate user             |
    | PATCH  | /api/admin/users/:id/deactivate | Deactivate user           |

## User Routes :
    | Method | Endpoint                  | Description     |
    | ------ | ------------------------- | --------------- |
    | GET    | /api/user/profile         | View profile    |
    | PUT    | /api/user/profile         | Update profile  |
    | PUT    | /api/user/change-password | Change password |
 
 ## 🧪 Testing :
    cd backend
    npm test

## 🌍 Deployment :
    🔗 Live Links
    Frontend: [https://mini-user-management-system-amber.vercel.app]
    Backend API: [https://mini-user-management-system-3u6w.onrender.com]

### Cold Start Handling
Since the backend is deployed on Render free tier, it may experience cold starts.
To mitigate this:
- A `/api/health` endpoint is implemented
- Frontend pings the backend on initial load to wake the server
- Loading states ensure smooth user experience

   
## 👨‍💻 Author :
    Avinash Kumar
    Backend Developer Intern Assessment – December 2025
    Purple Merit Technologies
