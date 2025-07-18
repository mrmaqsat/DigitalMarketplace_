import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./mongo-storage.js";
import { setupAuth } from "./auth";
import { 
  insertProductSchema, insertCartSchema, insertReviewSchema, checkoutWithShippingSchema,
  idParamSchema, paginationQuerySchema, productQuerySchema, orderStatusUpdateSchema,
  userUpdateSchema, referralCodeValidationSchema, fileUploadSchema
} from "@shared/models.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createStripeSession, getStripeSession, constructWebhookEvent } from "./stripe.js";
import { validateRequest, sanitizeInput, rateLimit } from "./middleware/validation.js";
import { requireAuth, requireRole, requireOwnership, preventPrivilegeEscalation, logSensitiveOperation } from "./middleware/auth.js";
import { auditLog } from "./middleware/audit.js";

interface AuthenticatedRequest extends Request {
  user?: any;
  files?: any;
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const products = await storage.getProducts(limit, offset);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'files', maxCount: 10 }
  ]), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      // Validate required fields
      if (!req.body.title || !req.body.description || !req.body.price || !req.body.categoryId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const images = files?.images?.map(file => `/uploads/${file.filename}`) || [];
      const productFiles = files?.files?.map(file => `/uploads/${file.filename}`) || [];

      if (images.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
      }

      if (productFiles.length === 0) {
        return res.status(400).json({ message: "At least one file is required" });
      }

      const productData = insertProductSchema.parse({
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        categoryId: req.body.categoryId,
        sellerId: req.user!.id,
        images,
        files: productFiles,
      });

      const product = await storage.createProduct(productData);

      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ message: "Invalid product data", error: error.message });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = req.params.id;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.sellerId.toString() !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedProduct = await storage.updateProduct(id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = req.params.id;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.sellerId.toString() !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      await storage.deleteProduct(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id/products", async (req, res) => {
    try {
      const id = req.params.id;
      const products = await storage.getProductsByCategory(id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category products" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const cartData = insertCartSchema.parse({
        userId: req.user!.id,
        productId: req.body.productId,
      });

      const cartItem = await storage.addToCart(cartData.userId, cartData.productId);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add to cart" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const productId = req.params.productId;
      await storage.removeFromCart(req.user!.id, productId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const orders = await storage.getOrders(req.user!.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create Stripe checkout session
  app.post("/api/create-checkout-session", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const total = cartItems.reduce((sum, item) => sum + parseFloat(item.product.price), 0);
      
      // Create pending order first
      let shippingDetails = {};
      if (cartItems.some(item => item.product.type === 'physical')) {
        const { shippingAddress, deliveryInstructions } = checkoutWithShippingSchema.parse(req.body);
        shippingDetails = { shippingAddress, deliveryInstructions };
      }

      const order = await storage.createOrder(
        {
          userId: req.user!.id,
          total: total.toString(),
          status: "pending",
          paymentStatus: "pending",
          fulfillmentStatus: "pending",
          ...shippingDetails
        },
        cartItems.map(item => ({
          productId: item.productId,
          price: item.product.price,
        }))
      );

      // Create Stripe session
      const session = await createStripeSession(
        cartItems.map(item => ({
          name: item.product.title,
          description: item.product.description,
          amount: parseFloat(item.product.price),
          quantity: 1,
        })),
        {
          orderId: order._id.toString(),
          userId: req.user!.id
        }
      );

      res.json({ 
        sessionId: session.id,
        url: session.url,
        orderId: order._id.toString()
      });
    } catch (error) {
      console.error('Stripe session creation error:', error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Get checkout session status
  app.get("/api/checkout-session/:sessionId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const session = await getStripeSession(req.params.sessionId);
      res.json({
        status: session.payment_status,
        customer_email: session.customer_details?.email
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve session" });
    }
  });

  // Legacy endpoint for direct order creation (kept for backwards compatibility)
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const cartItems = await storage.getCartItems(req.user!.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const total = cartItems.reduce((sum, item) => sum + parseFloat(item.product.price), 0);
      
      const order = await storage.createOrder(
        {
          userId: req.user!.id,
          total: total.toString(),
          status: "pending",
          paymentStatus: "pending",
          fulfillmentStatus: "pending"
        },
        cartItems.map(item => ({
          productId: item.productId,
          price: item.product.price,
        }))
      );

      // Clear cart after successful order
      await storage.clearCart(req.user!.id);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Reviews routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = req.params.id;
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const productId = parseInt(req.params.id);
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId: req.user!.id,
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  // Referral routes
  app.get("/api/referral/validate/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const user = await storage.getUserByReferralCode(code);
      if (user) {
        res.json({ valid: true, referrer: { username: user.username, fullName: user.fullName } });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to validate referral code" });
    }
  });

  app.get("/api/referral/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const stats = await storage.getReferralStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  app.get("/api/referral/my-referrals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const referrals = await storage.getUserReferrals(req.user!.id);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  app.get("/api/referral/link", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const referralLink = `${baseUrl}/register?ref=${user.referralCode}`;
      res.json({ referralLink, referralCode: user.referralCode });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate referral link" });
    }
  });

  // Seller routes
  app.get("/api/seller/products", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const products = await storage.getProductsBySeller(req.user!.id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller products" });
    }
  });

// Admin routes
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.put("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const id = req.params.id;
      const updatedUser = await storage.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const id = req.params.id;
      await storage.deleteUser(id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/products", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/admin/products/pending", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const products = await storage.getPendingProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending products" });
    }
  });

  app.post("/api/admin/products/:id/approve", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const id = req.params.id;
      await storage.approveProduct(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve product" });
    }
  });

  app.post("/api/admin/products/:id/reject", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const id = req.params.id;
      await storage.rejectProduct(id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject product" });
    }
  });

  // Admin order management routes for physical products
  app.put("/api/admin/orders/:id/fulfillment", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const orderId = req.params.id;
      const { fulfillmentStatus, trackingNumber } = req.body;
      
      const updates: any = {};
      if (fulfillmentStatus) updates.fulfillmentStatus = fulfillmentStatus;
      if (trackingNumber) updates.trackingNumber = trackingNumber;
      
      const updatedOrder = await storage.updateOrderStatus(orderId, updates);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order fulfillment" });
    }
  });

  // Get products by type (digital/physical)
  app.get("/api/products/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      if (type !== 'digital' && type !== 'physical') {
        return res.status(400).json({ message: "Invalid product type" });
      }
      
      const products = await storage.getProductsByType(type, limit, offset);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by type" });
    }
  });

  // Seller routes for managing physical product orders
  app.get("/api/seller/orders", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "seller") {
      return res.sendStatus(403);
    }

    try {
      const orders = await storage.getSellerOrders(req.user!.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller orders" });
    }
  });

  app.put("/api/seller/orders/:id/fulfillment", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "seller") {
      return res.sendStatus(403);
    }

    try {
      const orderId = req.params.id;
      const { fulfillmentStatus, trackingNumber } = req.body;
      
      // Check if seller owns products in this order
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const hasSellerProducts = order.items.some(item => item.product.sellerId.toString() === req.user!.id);
      if (!hasSellerProducts) {
        return res.status(403).json({ message: "Not authorized to update this order" });
      }
      
      const updates: any = {};
      if (fulfillmentStatus) updates.fulfillmentStatus = fulfillmentStatus;
      if (trackingNumber) updates.trackingNumber = trackingNumber;
      
      const updatedOrder = await storage.updateOrderStatus(orderId, updates);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order fulfillment" });
    }
  });

  // Admin referral analytics routes
  app.get("/api/admin/referral/analytics", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const users = await storage.getAllUsers();
      const totalUsers = users.length;
      const usersWithReferrals = users.filter(u => u.totalReferrals > 0);
      const totalReferrals = users.reduce((sum, u) => sum + u.totalReferrals, 0);
      const topReferrers = users
        .filter(u => u.totalReferrals > 0)
        .sort((a, b) => b.totalReferrals - a.totalReferrals)
        .slice(0, 10)
        .map(u => ({
          username: u.username,
          fullName: u.fullName,
          totalReferrals: u.totalReferrals,
          referralCode: u.referralCode
        }));
      
      res.json({
        totalUsers,
        totalReferrals,
        activeReferrers: usersWithReferrals.length,
        averageReferralsPerUser: totalReferrals / totalUsers,
        topReferrers
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch referral analytics" });
    }
  });

  app.get("/api/admin/referral/users/:userId", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "admin") {
      return res.sendStatus(403);
    }

    try {
      const userId = req.params.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const referrals = await storage.getUserReferrals(userId);
      const stats = await storage.getReferralStats(userId);
      
      res.json({
        user: {
          username: user.username,
          fullName: user.fullName,
          referralCode: user.referralCode,
          totalReferrals: user.totalReferrals
        },
        referrals: referrals.map(r => ({
          username: r.username,
          fullName: r.fullName,
          createdAt: r.createdAt
        })),
        stats
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user referral data" });
    }
  });

  // Stripe webhook endpoint
  app.post("/api/stripe-webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing stripe signature');
    }

    try {
      const event = constructWebhookEvent(req.body.toString(), sig);

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as any;
          const orderId = session.metadata.orderId;
          
          if (orderId) {
            // Update order status after successful payment
            await storage.updateOrderStatus(orderId, {
              status: 'completed',
              paymentStatus: 'completed',
              fulfillmentStatus: 'processing',
              paymentMethod: 'stripe'
            });

            // Clear cart after successful payment
            if (session.metadata.userId) {
              await storage.clearCart(session.metadata.userId);
            }
          }
          break;

        case 'checkout.session.expired':
          const expiredSession = event.data.object as any;
          const expiredOrderId = expiredSession.metadata.orderId;
          
          if (expiredOrderId) {
            // Update order status for expired session
            await storage.updateOrderStatus(expiredOrderId, {
              status: 'cancelled',
              paymentStatus: 'failed'
            });
          }
          break;

        case 'payment_intent.payment_failed':
          const paymentIntent = event.data.object as any;
          // Handle payment failure if needed
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
