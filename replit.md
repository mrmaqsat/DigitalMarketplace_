# DigitalMart - Digital Marketplace Platform

## Overview

DigitalMart is a full-stack digital marketplace platform built with React and Node.js, designed for buying and selling digital products. The application features a modern tech stack with TypeScript, PostgreSQL database, and a comprehensive component library using Radix UI and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Build Tool**: Vite for development and production builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **File Uploads**: Multer for handling file uploads with local storage

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection**: WebSocket-enabled connection pool for optimal performance

## Key Components

### User Management
- Multi-role authentication system (user, seller, admin)
- Secure password hashing using Node.js crypto (scrypt)
- Session-based authentication with PostgreSQL storage
- Protected routes with role-based access control

### Product Management
- Product catalog with categories, images, and file attachments
- Product approval workflow (pending → approved/rejected)
- Seller dashboard for product management
- Admin dashboard for platform oversight
- Review and rating system

### E-commerce Features
- Shopping cart functionality with persistent storage
- Order management system with status tracking
- File delivery system for digital products
- Multi-category product organization

### UI/UX Components
- Comprehensive design system using shadcn/ui components
- Responsive design with mobile-first approach
- Dark/light theme support via CSS variables
- Toast notifications and loading states
- Modal dialogs and sidebars for enhanced UX

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Passport.js validates against database using scrypt password comparison
3. Session created and stored in PostgreSQL
4. User object cached in React Query for client-side access
5. Protected routes check authentication status before rendering

### Product Purchase Flow
1. User browses products and adds items to cart
2. Cart state managed through TanStack Query with API persistence
3. Checkout process creates order record with associated order items
4. Cart cleared upon successful order completion
5. Digital files made available for download in user dashboard

### Product Upload Flow
1. Seller accesses upload form with file selection
2. Images and files uploaded via Multer to local storage
3. Product metadata stored in database with "pending" status
4. Admin reviews and approves/rejects products
5. Approved products appear in public marketplace

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Comprehensive UI component library
- **passport**: Authentication middleware
- **multer**: File upload handling
- **express-session**: Session management

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation

## Deployment Strategy

### Build Process
- Frontend: Vite builds React application to static assets
- Backend: esbuild bundles Node.js server with external dependencies
- Assets: Uploaded files served statically from uploads directory
- Database: Drizzle migrations applied via `db:push` command

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Secure session signing key (required)
- **NODE_ENV**: Environment flag (development/production)

### Production Considerations
- Session store configured for PostgreSQL persistence
- File uploads limited to 50MB with organized directory structure
- Trust proxy settings enabled for proper client IP detection
- Error handling with appropriate HTTP status codes

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```