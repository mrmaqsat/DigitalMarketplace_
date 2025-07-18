# DigitalMarketplace - MongoDB Edition

A modern digital marketplace platform built with React, Node.js, TypeScript, and MongoDB.

## 🚀 What's New

This application has been fully upgraded and migrated from PostgreSQL to MongoDB:

### ✅ Completed Upgrades

1. **Database Migration**: Migrated from PostgreSQL + Drizzle ORM to MongoDB + Mongoose
2. **Modern Dependencies**: Updated all packages to latest stable versions
3. **Enhanced Type Safety**: Improved TypeScript interfaces for MongoDB documents
4. **Better Performance**: MongoDB indexing and optimized queries
5. **Session Management**: Updated to use MongoDB for session storage

### 🛠 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for blazing-fast development
- TanStack Query for server state management
- Tailwind CSS + shadcn/ui components
- Wouter for lightweight routing

**Backend:**
- Node.js with Express.js
- TypeScript with ES modules
- MongoDB with Mongoose ODM
- Passport.js for authentication
- Multer for file uploads

**Database:**
- MongoDB (local or cloud instance)
- Indexes for optimal query performance
- Document relationships using ObjectIds

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or cloud instance like MongoDB Atlas)
3. **Git** (for version control)

## 🔧 Installation & Setup

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install MongoDB
**Option A: Local MongoDB**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS

**Option B: MongoDB Atlas (Cloud)**
- Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a cluster and get connection string

### 3. Clone and Setup Project
```bash
# Navigate to the project directory
cd "C:\Users\maksa\DigitalMarketplace (1)\Market"

# Install dependencies
npm install

# Create environment variables
# Copy .env.example to .env and configure:
```

### 4. Environment Configuration
Create a `.env` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/digitalmarketplace
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digitalmarketplace

# Session Secret (change this!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Environment
NODE_ENV=development
```

### 5. Seed the Database
```bash
# Run the seed script to populate with sample data
npm run db:seed
```

### 6. Start Development Server
```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 🗄 Database Schema

The MongoDB collections include:

- **users**: User accounts with roles (user, seller, admin)
- **categories**: Product categories with slugs and icons
- **products**: Digital products with files, images, and metadata
- **orders**: Purchase orders with status tracking
- **orderitems**: Individual items within orders
- **cart**: User shopping cart items
- **reviews**: Product reviews and ratings

## 🔐 Default Test Accounts

After seeding, you can use these accounts:

- **Admin**: admin@example.com / admin123
- **Seller**: john@example.com / seller123
- **Customer**: customer@example.com / user123

## 📁 Project Structure

```
Market/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configuration
├── server/              # Express backend
│   ├── db.ts           # MongoDB connection
│   ├── mongo-storage.ts # Database operations
│   ├── auth.ts         # Authentication setup
│   ├── routes.ts       # API routes
│   └── seed.ts         # Database seeding
├── shared/             # Shared types and models
│   └── models.ts       # Mongoose schemas and types
└── uploads/            # File upload directory
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Building
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:seed      # Seed database with sample data

# Type checking
npm run check        # Run TypeScript type checking
```

## 🌟 Key Features

- **Multi-role Authentication**: Admin, Seller, and User roles
- **Product Management**: Upload, approve, and manage digital products
- **Shopping Cart**: Add/remove items with persistent storage
- **Order Processing**: Complete order workflow with status tracking
- **File Management**: Secure file uploads for digital products
- **Review System**: Rate and review products
- **Admin Dashboard**: Manage users, products, and platform oversight
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🔧 MongoDB-Specific Features

- **ObjectId Support**: All entities use MongoDB ObjectIds
- **Document Relationships**: Proper population of referenced documents
- **Indexing**: Optimized indexes for better query performance
- **Transactions**: ACID transactions for order creation and reviews
- **Aggregation**: Complex queries using MongoDB aggregation pipeline

## 🛡 Security Features

- **Password Hashing**: Secure password storage using scrypt
- **Session Management**: MongoDB-backed sessions
- **File Upload Security**: Safe file handling with size limits
- **Role-based Access**: Proper authorization for different user roles

## 📝 API Endpoints

### Products
- `GET /api/products` - Get approved products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (sellers only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user

### Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:productId` - Remove from cart
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Ready to start coding?** Follow the installation steps above and you'll have a fully functional digital marketplace running with MongoDB! 🎉
