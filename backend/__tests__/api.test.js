const request = require('supertest');
const app = require('../src/app'); 
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let mongoServer;
let adminToken;
let userToken;
let testUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Admin user
  const admin = await User.create({
    email: 'admin@test.com',
    password: 'adminpass123', // ✅ STRING
    fullName: 'Admin User',
    role: 'admin',
  });
  adminToken = jwt.sign(
    { id: admin._id, role: 'admin' },
    process.env.JWT_SECRET
  );

  // Regular user
  const user = await User.create({
    email: 'user@test.com',
    password: 'userpass123', // ✅ STRING
    fullName: 'Regular User',
    role: 'user',
  });
  testUserId = user._id;
  userToken = jwt.sign(
    { id: user._id, role: 'user' },
    process.env.JWT_SECRET
  );
});


afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Backend API Tests', () => {
  // 1. Signup test
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        fullName: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('newuser@test.com');
  });

  // 2. Login test
  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'adminpass123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('admin');
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'wrongpass',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  // 3. Protected route test (e.g., get me)
  it('should access protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toBe('admin@test.com');
  });

  it('should deny access to protected route without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Not authorized, no token');
  });

  // 4. Admin access test (e.g., get all users)
  it('should allow admin to access admin-only route', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('should deny non-admin access to admin-only route', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBe('Not authorized as admin');
  });

  // 5. Password change test
  it('should change password for authenticated user', async () => {
    const res = await request(app)
      .put('/api/users/password')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        oldPassword: 'userpass123',
        newPassword: 'newpass123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Password changed');
  });

  it('should fail password change with invalid old password', async () => {
    const res = await request(app)
      .put('/api/users/password')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        oldPassword: 'wrongold',
        newPassword: 'newpass123',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Invalid old password');
  });

  // Bonus: More tests (e.g., pagination, activation)
  it('should get paginated users', async () => {
    const res = await request(app)
      .get('/api/users?page=1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('page', 1);
  });

  it('should activate a user', async () => {
    await User.findByIdAndUpdate(testUserId, { status: 'inactive' });
    const res = await request(app)
      .put(`/api/users/${testUserId}/activate`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('User activated');
  });
});