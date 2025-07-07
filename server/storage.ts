import { 
  users, products, categories, orders, orderItems, cart, reviews,
  type User, type InsertUser, type Product, type InsertProduct,
  type Order, type InsertOrder, type Cart, type InsertCart,
  type Review, type InsertReview, type Category, type OrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  approveProduct(id: number): Promise<boolean>;
  rejectProduct(id: number): Promise<boolean>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  
  // Cart methods
  getCartItems(userId: number): Promise<(Cart & { product: Product })[]>;
  addToCart(userId: number, productId: number): Promise<Cart>;
  removeFromCart(userId: number, productId: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order methods
  getOrders(userId: number): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder, items: { productId: number; price: string }[]): Promise<Order>;
  
  // Review methods
  getProductReviews(productId: number): Promise<(Review & { user: User })[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Admin methods
  getAllUsers(): Promise<User[]>;
  getAllProducts(): Promise<(Product & { seller: User; category: Category })[]>;
  getPendingProducts(): Promise<(Product & { seller: User; category: Category })[]>;
  
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(limit = 20, offset = 0): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.status, "approved"))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.categoryId, categoryId), eq(products.status, "approved")))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  async approveProduct(id: number): Promise<boolean> {
    const result = await db
      .update(products)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  async rejectProduct(id: number): Promise<boolean> {
    const result = await db
      .update(products)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCartItems(userId: number): Promise<(Cart & { product: Product })[]> {
    return await db
      .select()
      .from(cart)
      .innerJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId))
      .then(rows => rows.map(row => ({ ...row.cart, product: row.products })));
  }

  async addToCart(userId: number, productId: number): Promise<Cart> {
    const [cartItem] = await db
      .insert(cart)
      .values({ userId, productId })
      .returning();
    return cartItem;
  }

  async removeFromCart(userId: number, productId: number): Promise<boolean> {
    const result = await db
      .delete(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cart).where(eq(cart.userId, userId));
    return (result.rowCount || 0) > 0;
  }

  async getOrders(userId: number): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id))
          .then(rows => rows.map(row => ({ ...row.order_items, product: row.products })));
        
        return { ...order, items };
      })
    );

    return ordersWithItems;
  }

  async getOrder(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id))
      .then(rows => rows.map(row => ({ ...row.order_items, product: row.products })));

    return { ...order, items };
  }

  async createOrder(order: InsertOrder, items: { productId: number; price: string }[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    await db.insert(orderItems).values(
      items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        price: item.price,
      }))
    );

    return newOrder;
  }

  async getProductReviews(productId: number): Promise<(Review & { user: User })[]> {
    return await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .then(rows => rows.map(row => ({ ...row.reviews, user: row.users })));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update product rating
    const avgRating = await db
      .select({ avg: sql<number>`avg(${reviews.rating})`, count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.productId, review.productId));

    if (avgRating[0]) {
      await db
        .update(products)
        .set({
          rating: avgRating[0].avg.toFixed(2),
          reviewCount: avgRating[0].count,
        })
        .where(eq(products.id, review.productId));
    }

    return newReview;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllProducts(): Promise<(Product & { seller: User; category: Category })[]> {
    return await db
      .select()
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt))
      .then(rows => rows.map(row => ({ 
        ...row.products, 
        seller: row.users, 
        category: row.categories 
      })));
  }

  async getPendingProducts(): Promise<(Product & { seller: User; category: Category })[]> {
    return await db
      .select()
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id))
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.status, "pending"))
      .orderBy(desc(products.createdAt))
      .then(rows => rows.map(row => ({ 
        ...row.products, 
        seller: row.users, 
        category: row.categories 
      })));
  }
}

export const storage = new DatabaseStorage();
