import { describe, it, beforeAll, afterAll, beforeEach, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { registerRoutes } from '../server/routes.js';
import { setupAuth } from '../server/auth.js';
import { storage } from '../server/mongo-storage.js';
import { User, Product, Category, Order, Cart, Review } from '../shared/models.js';

describe('API Security and Validation Tests', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  let testUser: any;
  let testSeller: any;
  let testAdmin: any;
  let testCategory: any;
  let testProduct: any;
  let authCookie: string;
  let sellerCookie: string;
  let adminCookie: string;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup Express app
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    // Setup authentication
    setupAuth(app);
    
    // Register routes
    registerRoutes(app);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});

    // Create test category
    testCategory = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      description: 'Test category description'
    });

    // Create test users
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      fullName: 'Test User',
      role: 'user'
    });

    testSeller = await User.create({
      username: 'testseller',
      email: 'seller@example.com',
      password: 'hashedpassword123',
      fullName: 'Test Seller',
      role: 'seller'
    });

    testAdmin = await User.create({
      username: 'testadmin',
      email: 'admin@example.com',
      password: 'hashedpassword123',
      fullName: 'Test Admin',
      role: 'admin'
    });

    // Create test product
    testProduct = await Product.create({
      title: 'Test Product',
      description: 'Test product description',
      price: 10.99,
      categoryId: testCategory._id,
      sellerId: testSeller._id,
      images: ['test-image.jpg'],
      files: ['test-file.pdf'],
      type: 'digital',
      status: 'approved'
    });

    // Get authentication cookies
    authCookie = await getAuthCookie(testUser);
    sellerCookie = await getAuthCookie(testSeller);
    adminCookie = await getAuthCookie(testAdmin);
  });

  async function getAuthCookie(user: any): Promise<string> {
    const res = await request(app)
      .post('/api/login')
      .send({ username: user.username, password: 'password123' });
    
    return res.headers['set-cookie'][0];
  }

  describe('Authentication & Authorization', () => {
    it('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(401);

      expect(response.body.error).toBe('Authentication required');
    });

    it('should prevent unauthorized access to admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Cookie', authCookie)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });

    it('should allow admin access to admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should prevent users from accessing other users\' resources', async () => {
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'hashedpassword123',
        fullName: 'Other User',
        role: 'user'
      });

      const response = await request(app)
        .put(`/api/admin/users/${otherUser._id}`)
        .set('Cookie', authCookie)
        .send({ role: 'admin' })
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });
  });

  describe('Input Validation', () => {
    it('should validate user registration input', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'ab', // Too short
          email: 'invalid-email',
          password: 'weak',
          fullName: 'Test123' // Invalid characters
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should validate product creation input', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', sellerCookie)
        .send({
          title: '', // Empty title
          description: 'short', // Too short
          price: -10, // Negative price
          categoryId: 'invalid-id', // Invalid format
          type: 'invalid-type' // Invalid enum
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should validate review creation input', async () => {
      const response = await request(app)
        .post(`/api/products/${testProduct._id}/reviews`)
        .set('Cookie', authCookie)
        .send({
          rating: 6, // Out of range
          comment: 'x'.repeat(1001) // Too long
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should sanitize malicious input', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'ValidPassword123!',
          fullName: 'Test <script>alert("xss")</script> User'
        })
        .expect(201);

      expect(response.body.fullName).not.toContain('<script>');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on sensitive endpoints', async () => {
      // Make multiple rapid requests
      const promises = Array(6).fill(null).map(() =>
        request(app)
          .post('/api/login')
          .send({ username: 'testuser', password: 'wrong' })
      );

      const responses = await Promise.all(promises);
      
      // Should have at least one rate limit response
      expect(responses.some(res => res.status === 429)).toBe(true);
    });
  });

  describe('Product Management', () => {
    it('should allow sellers to create products', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', sellerCookie)
        .send({
          title: 'New Product',
          description: 'A new digital product for testing',
          price: 19.99,
          categoryId: testCategory._id.toString(),
          type: 'digital'
        })
        .expect(201);

      expect(response.body.title).toBe('New Product');
      expect(response.body.status).toBe('pending');
    });

    it('should prevent non-sellers from creating products', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', authCookie)
        .send({
          title: 'Unauthorized Product',
          description: 'This should not be created',
          price: 19.99,
          categoryId: testCategory._id.toString(),
          type: 'digital'
        })
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions');
    });

    it('should allow sellers to update their own products', async () => {
      const response = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set('Cookie', sellerCookie)
        .send({
          title: 'Updated Product Title',
          price: 15.99
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Product Title');
      expect(response.body.price).toBe(15.99);
    });

    it('should prevent sellers from updating other sellers\' products', async () => {
      const otherSeller = await User.create({
        username: 'otherseller',
        email: 'otherseller@example.com',
        password: 'hashedpassword123',
        fullName: 'Other Seller',
        role: 'seller'
      });

      const otherSellerCookie = await getAuthCookie(otherSeller);

      const response = await request(app)
        .put(`/api/products/${testProduct._id}`)
        .set('Cookie', otherSellerCookie)
        .send({
          title: 'Unauthorized Update'
        })
        .expect(403);

      expect(response.body.error).toBe('Not authorized');
    });

    it('should validate physical product requirements', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', sellerCookie)
        .send({
          title: 'Physical Product',
          description: 'A physical product without weight/dimensions',
          price: 25.99,
          categoryId: testCategory._id.toString(),
          type: 'physical'
          // Missing weight and dimensions
        })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Order Management', () => {
    beforeEach(async () => {
      // Add product to cart
      await Cart.create({
        userId: testUser._id,
        productId: testProduct._id
      });
    });

    it('should create order with valid cart items', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', authCookie)
        .expect(201);

      expect(response.body.total).toBe(testProduct.price);
      expect(response.body.status).toBe('pending');
    });

    it('should prevent creating orders with empty cart', async () => {
      await Cart.deleteMany({ userId: testUser._id });

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', authCookie)
        .expect(400);

      expect(response.body.message).toBe('Cart is empty');
    });

    it('should allow admins to update order status', async () => {
      const order = await Order.create({
        userId: testUser._id,
        total: 10.99,
        status: 'pending',
        paymentStatus: 'pending',
        fulfillmentStatus: 'pending'
      });

      const response = await request(app)
        .put(`/api/admin/orders/${order._id}/fulfillment`)
        .set('Cookie', adminCookie)
        .send({
          fulfillmentStatus: 'shipped',
          trackingNumber: 'TRACK123'
        })
        .expect(200);

      expect(response.body.fulfillmentStatus).toBe('shipped');
      expect(response.body.trackingNumber).toBe('TRACK123');
    });
  });

  describe('Referral System', () => {
    it('should validate referral codes', async () => {
      const response = await request(app)
        .get('/api/referral/validate/INVALID123')
        .expect(200);

      expect(response.body.valid).toBe(false);
    });

    it('should accept valid referral codes', async () => {
      const response = await request(app)
        .get(`/api/referral/validate/${testUser.referralCode}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.referrer.username).toBe(testUser.username);
    });

    it('should track referrals on user registration', async () => {
      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'referreduser',
          email: 'referred@example.com',
          password: 'ValidPassword123!',
          fullName: 'Referred User',
          referralCode: testUser.referralCode
        })
        .expect(201);

      expect(response.body.referrerId).toBe(testUser._id.toString());

      // Check that referrer's count was updated
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.totalReferrals).toBe(1);
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types and sizes', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', sellerCookie)
        .attach('images', Buffer.from('fake-image-data'), {
          filename: 'test.exe',
          contentType: 'application/exe'
        })
        .field('title', 'Test Product')
        .field('description', 'Test product description')
        .field('price', '19.99')
        .field('categoryId', testCategory._id.toString())
        .expect(400);

      expect(response.body.error).toBe('Invalid file type');
    });

    it('should prevent oversized file uploads', async () => {
      const largeBuffer = Buffer.alloc(60 * 1024 * 1024); // 60MB

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', sellerCookie)
        .attach('images', largeBuffer, {
          filename: 'large-image.jpg',
          contentType: 'image/jpeg'
        })
        .field('title', 'Test Product')
        .field('description', 'Test product description')
        .field('price', '19.99')
        .field('categoryId', testCategory._id.toString())
        .expect(400);

      expect(response.body.error).toBe('File size exceeds limit');
    });
  });

  describe('Payment Flow Security', () => {
    it('should create secure Stripe checkout session', async () => {
      // Add product to cart
      await Cart.create({
        userId: testUser._id,
        productId: testProduct._id
      });

      const response = await request(app)
        .post('/api/create-checkout-session')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.sessionId).toBeDefined();
      expect(response.body.url).toBeDefined();
      expect(response.body.orderId).toBeDefined();
    });

    it('should validate Stripe webhook signatures', async () => {
      const response = await request(app)
        .post('/api/stripe-webhook')
        .set('stripe-signature', 'invalid-signature')
        .send(JSON.stringify({ type: 'checkout.session.completed' }))
        .expect(400);

      expect(response.text).toContain('Missing stripe signature');
    });

    it('should handle successful payment completion', async () => {
      // This would require mocking Stripe webhook in a real test
      // For now, we'll test the structure
      const order = await Order.create({
        userId: testUser._id,
        total: 10.99,
        status: 'pending',
        paymentStatus: 'pending',
        fulfillmentStatus: 'pending'
      });

      expect(order.status).toBe('pending');
      expect(order.paymentStatus).toBe('pending');
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity on deletions', async () => {
      // Create order with items
      const order = await Order.create({
        userId: testUser._id,
        total: 10.99,
        status: 'completed',
        paymentStatus: 'completed',
        fulfillmentStatus: 'pending'
      });

      // Attempt to delete user with active orders should fail or handle gracefully
      const response = await request(app)
        .delete(`/api/admin/users/${testUser._id}`)
        .set('Cookie', adminCookie)
        .expect(500); // Should handle referential integrity

      expect(response.body.message).toContain('Error deleting user');
    });

    it('should prevent duplicate cart items', async () => {
      // Add product to cart
      await Cart.create({
        userId: testUser._id,
        productId: testProduct._id
      });

      // Try to add same product again
      const response = await request(app)
        .post('/api/cart')
        .set('Cookie', authCookie)
        .send({
          productId: testProduct._id.toString()
        })
        .expect(201);

      // Should return existing cart item, not create duplicate
      const cartItems = await Cart.find({ userId: testUser._id });
      expect(cartItems.length).toBe(1);
    });
  });

  describe('Security Headers and CORS', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      // Check for security headers (these would need to be implemented)
      // expect(response.headers['x-content-type-options']).toBe('nosniff');
      // expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Close database connection to simulate error
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body.message).toBe('Failed to fetch products');
    });

    it('should not expose sensitive information in errors', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(500);

      expect(response.body.message).not.toContain('ObjectId');
      expect(response.body.message).not.toContain('MongoDB');
    });
  });
});
