import mongoose, { Schema, Document, Types } from 'mongoose';
import { z } from 'zod';

// Interfaces for TypeScript
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'seller' | 'admin';
  referrerId?: Types.ObjectId;
  referralCode: string;
  totalReferrals: number;
  createdAt: Date;
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  background?: string;
  image?: string;
  backgroundGradient?: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  categoryId: Types.ObjectId;
  sellerId: Types.ObjectId;
  images: string[];
  files: string[];
  type: 'digital' | 'physical';
  weight?: number; // for physical products
  dimensions?: { length: number; width: number; height: number }; // for physical products
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod?: string;
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  deliveryInstructions?: string;
  trackingNumber?: string;
  shippingCost?: number;
  createdAt: Date;
}

export interface IOrderItem extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  price: number;
  createdAt: Date;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
}

export interface IReview extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Mongoose Schemas
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  referralCode: {
    type: String,
    required: true,
    unique: true
  },
  totalReferrals: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String
  },
  background: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  backgroundGradient: {
    type: String,
    trim: true
  }
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  files: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['digital', 'physical'],
    required: true,
    default: 'digital'
  },
  weight: {
    type: Number,
    min: 0,
    required: function() {
      return this.type === 'physical';
    }
  },
  dimensions: {
    length: {
      type: Number,
      min: 0,
      required: function() {
        return this.type === 'physical';
      }
    },
    width: {
      type: Number,
      min: 0,
      required: function() {
        return this.type === 'physical';
      }
    },
    height: {
      type: Number,
      min: 0,
      required: function() {
        return this.type === 'physical';
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  fulfillmentStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  shippingAddress: {
    fullName: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  deliveryInstructions: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  shippingCost: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const orderItemSchema = new Schema<IOrderItem>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const reviewSchema = new Schema<IReview>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ referrerId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ type: 1 });
productSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ fulfillmentStatus: 1 });
cartSchema.index({ userId: 1 });
reviewSchema.index({ productId: 1 });

// Pre-save middleware to generate referral code and update updatedAt
function generateReferralCode(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

userSchema.pre('save', async function(next) {
  if (this.isNew && !this.referralCode) {
    let code = generateReferralCode();
    // Ensure uniqueness
    while (await User.findOne({ referralCode: code })) {
      code = generateReferralCode();
    }
    this.referralCode = code;
  }
  next();
});

productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Models
export const User = mongoose.model<IUser>('User', userSchema);
export const Category = mongoose.model<ICategory>('Category', categorySchema);
export const Product = mongoose.model<IProduct>('Product', productSchema);
export const Order = mongoose.model<IOrder>('Order', orderSchema);
export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);
export const Cart = mongoose.model<ICart>('Cart', cartSchema);
export const Review = mongoose.model<IReview>('Review', reviewSchema);

// Enhanced Zod validation schemas with comprehensive validation
export const insertUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  role: z.enum(['user', 'seller', 'admin']).optional(),
  referralCode: z.string().optional()
});

export const insertProductSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  price: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price must be less than $999,999.99')
    .refine((val) => Number.isFinite(val), 'Price must be a valid number'),
  categoryId: z.string()
    .min(1, 'Category is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
  sellerId: z.string()
    .min(1, 'Seller ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid seller ID format'),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed')
    .optional(),
  files: z.array(z.string())
    .min(1, 'At least one file is required for digital products')
    .max(20, 'Maximum 20 files allowed')
    .optional(),
  type: z.enum(['digital', 'physical']).default('digital'),
  weight: z.number().positive('Weight must be positive').optional(),
  dimensions: z.object({
    length: z.number().positive('Length must be positive'),
    width: z.number().positive('Width must be positive'),
    height: z.number().positive('Height must be positive')
  }).optional()
}).refine((data) => {
  // Validate that physical products have weight and dimensions
  if (data.type === 'physical') {
    return data.weight !== undefined && data.dimensions !== undefined;
  }
  return true;
}, {
  message: 'Physical products must have weight and dimensions',
  path: ['type']
});

export const insertOrderSchema = z.object({
  userId: z.string(),
  total: z.number().positive(),
  status: z.enum(['pending', 'completed', 'cancelled']).optional()
});

export const insertCartSchema = z.object({
  userId: z.string(),
  productId: z.string()
});

export const insertReviewSchema = z.object({
  productId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

// Shipping address validation schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  phone: z.string().optional()
});

// Checkout with shipping schema
export const checkoutWithShippingSchema = z.object({
  shippingAddress: shippingAddressSchema.optional(),
  deliveryInstructions: z.string().optional()
});

// Parameter validation schemas
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
});

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

export const productQuerySchema = z.object({
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  sellerId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  type: z.enum(['digital', 'physical']).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().max(100).optional()
}).merge(paginationQuerySchema);

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'completed', 'failed']).optional(),
  fulfillmentStatus: z.enum(['pending', 'processing', 'shipped', 'delivered']).optional(),
  trackingNumber: z.string().max(100).optional(),
  shippingCost: z.number().min(0).optional()
}).refine((data) => {
  // At least one field must be provided
  return Object.keys(data).some(key => data[key] !== undefined);
}, {
  message: 'At least one field must be provided for update'
});

export const userUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional(),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .optional(),
  role: z.enum(['user', 'seller', 'admin']).optional()
}).refine((data) => {
  // At least one field must be provided
  return Object.keys(data).some(key => data[key] !== undefined);
}, {
  message: 'At least one field must be provided for update'
});

export const referralCodeValidationSchema = z.object({
  code: z.string()
    .min(1, 'Referral code is required')
    .max(20, 'Referral code is too long')
    .regex(/^[A-Z0-9]+$/, 'Invalid referral code format')
});

export const auditLogQuerySchema = z.object({
  action: z.string().optional(),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  ip: z.string().ip().optional()
}).merge(paginationQuerySchema);

// Enhanced order and cart validation
export const enhancedInsertOrderSchema = insertOrderSchema.extend({
  paymentMethod: z.string().max(50).optional(),
  fulfillmentStatus: z.enum(['pending', 'processing', 'shipped', 'delivered']).optional(),
  shippingAddress: shippingAddressSchema.optional(),
  deliveryInstructions: z.string().max(500).optional(),
  shippingCost: z.number().min(0).optional()
});

export const enhancedInsertCartSchema = insertCartSchema.extend({
  quantity: z.number().int().min(1).max(99).default(1)
});

export const enhancedInsertReviewSchema = insertReviewSchema.extend({
  comment: z.string()
    .max(1000, 'Comment must be less than 1000 characters')
    .optional()
}).refine((data) => {
  // Either comment or rating must be provided
  return data.comment !== undefined || data.rating !== undefined;
}, {
  message: 'Either comment or rating must be provided'
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  size: z.number().max(50 * 1024 * 1024, 'File size must be less than 50MB'),
  mimetype: z.string().refine((type) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/zip',
      'application/octet-stream'
    ];
    return allowedTypes.includes(type);
  }, 'Invalid file type')
});

// Type exports for frontend
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CheckoutWithShipping = z.infer<typeof checkoutWithShippingSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type ReferralCodeValidation = z.infer<typeof referralCodeValidationSchema>;
export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
export type EnhancedInsertOrder = z.infer<typeof enhancedInsertOrderSchema>;
export type EnhancedInsertCart = z.infer<typeof enhancedInsertCartSchema>;
export type EnhancedInsertReview = z.infer<typeof enhancedInsertReviewSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
