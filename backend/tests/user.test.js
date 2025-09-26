require('./setupTestDB'); // ganz oben einbinden
const request = require('supertest');
const app = require('../src/server');

describe('User API', () => {

  it('should require all registration fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: '', email: '', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'tester', email: 'tester@example.com', password: 'geheim123' });
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
  });

});
