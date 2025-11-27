const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

describe('Product API', () => {
  let token;
  let testProduct;

  beforeAll(async () => {
    // Create test user
    const user = await User.create({
      name: 'Test Owner',
      email: 'test@example.com',
      password: 'password123',
      role: 'OWNER',
    });
    token = generateToken(user._id);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          sku: 'TEST-001',
          salePrice: 29.99,
          currentStock: 100,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Product');
      testProduct = res.body.data;
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test', sku: 'TEST-002', salePrice: 10 });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    it('should return products list', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by search query', async () => {
      const res = await request(app)
        .get('/api/products?search=Test')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
