const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { User, Product, Sale, Settings } = require('../models');
const { generateToken } = require('../utils/jwt');

describe('Sale API', () => {
  let token;
  let testUser;
  let testProduct;

  beforeAll(async () => {
    // Create settings
    await Settings.create({ invoicePrefix: 'TEST', nextInvoiceNumber: 1 });

    // Create test user
    testUser = await User.create({
      name: 'Test Cashier',
      email: 'cashier@test.com',
      password: 'password123',
      role: 'CASHIER',
    });
    token = generateToken(testUser._id);

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      sku: 'TEST-001',
      salePrice: 29.99,
      currentStock: 100,
      taxRate: 10,
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    await Settings.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/sales', () => {
    it('should create a new sale', async () => {
      const res = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            {
              productId: testProduct._id,
              name: testProduct.name,
              quantity: 2,
              unitPrice: testProduct.salePrice,
              taxRate: testProduct.taxRate,
            },
          ],
          paymentMethod: 'CASH',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.invoiceNo).toMatch(/^TEST-/);
      expect(res.body.data.items).toHaveLength(1);
    });

    it('should deduct stock after sale', async () => {
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.currentStock).toBe(98);
    });

    it('should fail with insufficient stock', async () => {
      const res = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            {
              productId: testProduct._id,
              name: testProduct.name,
              quantity: 1000,
              unitPrice: testProduct.salePrice,
            },
          ],
          paymentMethod: 'CASH',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/sales', () => {
    it('should return sales list', async () => {
      const res = await request(app)
        .get('/api/sales')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
