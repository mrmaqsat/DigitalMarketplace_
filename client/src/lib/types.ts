// Client-side type definitions for API responses and data models
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  sellerId: string;
  images: string[];
  files: string[];
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  background?: string; // hex color code or image URL
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
