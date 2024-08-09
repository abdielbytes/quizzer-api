const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path if needed

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth API', () => {
  // Setup before all tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Cleanup after all tests
  after(async () => {
    await User.deleteMany({}); // Clean up users after tests
    await mongoose.disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should not register a user with an existing email', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should not login with incorrect password', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});
