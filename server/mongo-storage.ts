import { 
  User, Category, Product, Order, OrderItem, Cart, Review,
  type IUser, type ICategory, type IProduct, type IOrder, 
  type IOrderItem, type ICart, type IReview,
  type InsertUser, type InsertProduct, type InsertOrder, 
  type InsertCart, type InsertReview
} from "@shared/models.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
  
  // Referral methods
  getUserByReferralCode(referralCode: string): Promise<IUser | null>;
  getUserReferrals(userId: string): Promise<IUser[]>;
  getReferralStats(userId: string): Promise<{totalReferrals: number, recentReferrals: IUser[]}>;
  updateReferralCount(userId: string, increment: number): Promise<void>;
  
  // Product methods
  getProducts(limit?: number, offset?: number): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct | null>;
  getProductsBySeller(sellerId: string): Promise<IProduct[]>;
  getProductsByCategory(categoryId: string): Promise<IProduct[]>;
  createProduct(product: InsertProduct & { images: string[]; files: string[] }): Promise<IProduct>;
  updateProduct(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
  approveProduct(id: string): Promise<boolean>;
  rejectProduct(id: string): Promise<boolean>;
  
  // Category methods
  getCategories(): Promise<ICategory[]>;
  getCategory(id: string): Promise<ICategory | null>;
  
  // Cart methods
  getCartItems(userId: string): Promise<(ICart & { product: IProduct })[]>;
  addToCart(userId: string, productId: string): Promise<ICart>;
  removeFromCart(userId: string, productId: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Order methods
  getOrders(userId: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] })[]>;
  getOrder(id: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] }) | null>;
  createOrder(order: InsertOrder, items: { productId: string; price: number }[]): Promise<IOrder>;
  updateOrderStatus(orderId: string, updates: Partial<IOrder>): Promise<IOrder | null>;
  
  // Review methods
  getProductReviews(productId: string): Promise<(IReview & { user: IUser })[]>;
  createReview(review: InsertReview): Promise<IReview>;
  
  // Admin methods
  getAllUsers(): Promise<IUser[]>;
  getAllProducts(): Promise<(IProduct & { seller: IUser; category: ICategory })[]>;
  getPendingProducts(): Promise<(IProduct & { seller: IUser; category: ICategory })[]>;
  getAllOrders(): Promise<(IOrder & { user: IUser; items: (IOrderItem & { product: IProduct })[] })[]>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  
  // Physical product methods
  getProductsByType(type: 'digital' | 'physical', limit?: number, offset?: number): Promise<IProduct[]>;
  getSellerOrders(sellerId: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] })[]>;
  
  sessionStore: any;
}

export class MongoStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const mongoUrl = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/digitalmarketplace';
    this.sessionStore = MongoStore.create({
      mongoUrl,
      touchAfter: 24 * 3600 // lazy session update
    });
  }

  async getUser(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const user = new User(insertUser);
    return await user.save();
  }

  async getProducts(limit = 20, offset = 0): Promise<IProduct[]> {
    return await Product.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate('categoryId')
      .populate('sellerId');
  }

  async getProduct(id: string): Promise<IProduct | null> {
    return await Product.findById(id)
      .populate('categoryId')
      .populate('sellerId');
  }

  async getProductsBySeller(sellerId: string): Promise<IProduct[]> {
    return await Product.find({ sellerId })
      .sort({ createdAt: -1 })
      .populate('categoryId');
  }

  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    return await Product.find({ categoryId, status: "approved" })
      .sort({ createdAt: -1 })
      .populate('sellerId');
  }

  async createProduct(product: InsertProduct & { images: string[]; files: string[] }): Promise<IProduct> {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id, 
      { ...productData, updatedAt: new Date() }, 
      { new: true }
    );
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
  }

  async approveProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndUpdate(
      id, 
      { status: "approved", updatedAt: new Date() }
    );
    return result !== null;
  }

  async rejectProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndUpdate(
      id, 
      { status: "rejected", updatedAt: new Date() }
    );
    return result !== null;
  }

  async getCategories(): Promise<ICategory[]> {
    return await Category.find().sort({ name: 1 });
  }

  async getCategory(id: string): Promise<ICategory | null> {
    return await Category.findById(id);
  }

  async getCartItems(userId: string): Promise<(ICart & { product: IProduct })[]> {
    const cartItems = await Cart.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });
    
    return cartItems.map(item => ({
      ...item.toObject(),
      product: item.productId as any
    }));
  }

  async addToCart(userId: string, productId: string): Promise<ICart> {
    // Check if item already exists in cart
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      return existingItem;
    }
    
    const cartItem = new Cart({ userId, productId });
    return await cartItem.save();
  }

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    const result = await Cart.findOneAndDelete({ userId, productId });
    return result !== null;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await Cart.deleteMany({ userId });
    return result.deletedCount > 0;
  }

  async getOrders(userId: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] })[]> {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id })
          .populate('productId');
        
        return {
          ...order.toObject(),
          items: items.map(item => ({
            ...item.toObject(),
            product: item.productId as any
          }))
        };
      })
    );
    
    return ordersWithItems;
  }

  async getOrder(id: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] }) | null> {
    const order = await Order.findById(id);
    if (!order) return null;
    
    const items = await OrderItem.find({ orderId: order._id })
      .populate('productId');
    
    return {
      ...order.toObject(),
      items: items.map(item => ({
        ...item.toObject(),
        product: item.productId as any
      }))
    };
  }

  async createOrder(orderData: InsertOrder, items: { productId: string; price: number }[]): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create the order
      const order = new Order(orderData);
      await order.save({ session });
      
      // Create order items
      const orderItems = items.map(item => ({
        orderId: order._id,
        productId: item.productId,
        price: item.price
      }));
      
      await OrderItem.insertMany(orderItems, { session });
      
      // Update product sales counts only if order is completed
      if (orderData.status === 'completed') {
        await Promise.all(items.map(async (item) => {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { salesCount: 1 } },
            { session }
          );
        }));
      }
      
      await session.commitTransaction();
      session.endSession();
      
      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, updates: Partial<IOrder>): Promise<IOrder | null> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Get the current order
      const currentOrder = await Order.findById(orderId).session(session);
      if (!currentOrder) {
        await session.abortTransaction();
        session.endSession();
        return null;
      }
      
      // Update the order
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        updates,
        { new: true, session }
      );
      
      // If payment is completed and order status changed to completed, update sales count
      if (updates.status === 'completed' && currentOrder.status !== 'completed') {
        const orderItems = await OrderItem.find({ orderId }).session(session);
        await Promise.all(orderItems.map(async (item) => {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { salesCount: 1 } },
            { session }
          );
        }));
      }
      
      await session.commitTransaction();
      session.endSession();
      
      return updatedOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getProductReviews(productId: string): Promise<(IReview & { user: IUser })[]> {
    const reviews = await Review.find({ productId })
      .populate('userId')
      .sort({ createdAt: -1 });
    
    return reviews.map(review => ({
      ...review.toObject(),
      user: review.userId as any
    }));
  }

  async createReview(reviewData: InsertReview): Promise<IReview> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create the review
      const review = new Review(reviewData);
      await review.save({ session });
      
      // Update product rating and review count
      const reviews = await Review.find({ productId: reviewData.productId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await Product.findByIdAndUpdate(
        reviewData.productId,
        { 
          rating: Math.round(avgRating * 100) / 100,
          reviewCount: reviews.length
        },
        { session }
      );
      
      await session.commitTransaction();
      session.endSession();
      
      return review;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find().sort({ createdAt: -1 });
  }

  async getAllProducts(): Promise<(IProduct & { seller: IUser; category: ICategory })[]> {
    const products = await Product.find()
      .populate('sellerId')
      .populate('categoryId')
      .sort({ createdAt: -1 });
    
    return products.map(product => ({
      ...product.toObject(),
      seller: product.sellerId as any,
      category: product.categoryId as any
    }));
  }

  async getPendingProducts(): Promise<(IProduct & { seller: IUser; category: ICategory })[]> {
    const products = await Product.find({ status: "pending" })
      .populate('sellerId')
      .populate('categoryId')
      .sort({ createdAt: -1 });
    
    return products.map(product => ({
      ...product.toObject(),
      seller: product.sellerId as any,
      category: product.categoryId as any
    }));
  }
  async getAllOrders(): Promise<(IOrder & { user: IUser; items: (IOrderItem & { product: IProduct })[] })[]> {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId');

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id })
          .populate('productId');

        return {
          ...order.toObject(),
          user: order.userId as any,
          items: items.map(item => ({
            ...item.toObject(),
            product: item.productId as any
          }))
        };
      })
    );
    return ordersWithItems;
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { ...userData }, { new: true });
  }

  async getUserByReferralCode(referralCode: string): Promise<IUser | null> {
    return await User.findOne({ referralCode });
  }

  async getUserReferrals(userId: string): Promise<IUser[]> {
    return await User.find({ referrerId: userId });
  }

  async getReferralStats(userId: string): Promise<{totalReferrals: number, recentReferrals: IUser[]}> {
    const totalReferrals = await User.countDocuments({ referrerId: userId });
    const recentReferrals = await User.find({ referrerId: userId }).sort({ createdAt: -1 }).limit(5);
    return { totalReferrals, recentReferrals };
  }

  async updateReferralCount(userId: string, increment: number): Promise<void> {
    await User.findByIdAndUpdate(userId, { $inc: { totalReferrals: increment } });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  async getProductsByType(type: 'digital' | 'physical', limit = 20, offset = 0): Promise<IProduct[]> {
    return await Product.find({ type, status: "approved" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate('categoryId')
      .populate('sellerId');
  }

  async getSellerOrders(sellerId: string): Promise<(IOrder & { items: (IOrderItem & { product: IProduct })[] })[]> {
    // Find orders that contain products from this seller
    const orderItems = await OrderItem.find()
      .populate('productId')
      .populate('orderId');
    
    const sellerOrderIds = orderItems
      .filter(item => (item.productId as any).sellerId.toString() === sellerId)
      .map(item => item.orderId);
    
    const uniqueOrderIds = [...new Set(sellerOrderIds.map(order => (order as any)._id.toString()))];
    
    const orders = await Order.find({ _id: { $in: uniqueOrderIds } })
      .sort({ createdAt: -1 });
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id })
          .populate('productId');
        
        return {
          ...order.toObject(),
          items: items.map(item => ({
            ...item.toObject(),
            product: item.productId as any
          }))
        };
      })
    );
    
    return ordersWithItems;
  }
}

export const storage = new MongoStorage();
