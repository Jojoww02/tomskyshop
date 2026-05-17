# Game Top-Up Website - Product Requirements Document (PRD)

## 1. Project Overview

**Project Name:** TomSkyShop - Game Top-Up Platform  
**Project Type:** Full-stack E-commerce Web Application  
**Core Functionality:** Platform untuk top-up game online dengan berbagai metode pembayaran  
**Target Users:** Gamers Indonesia yang ingin membeli diamond, coin, atau item in-game

## 2. Tech Stack

### Frontend
- **Framework:** React + Inertia.js + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Build Tool:** Vite

### Backend
- **Framework:** Laravel 11 (PHP 8.2+)
- **API:** RESTful API dengan Laravel API Routes
- **Authentication:** Laravel Sanctum

### Database
- **Primary Database:** PostgreSQL 15+
- **ORM:** Eloquent
- **Migration:** Laravel Migrations

## 3. Core Features

### 3.1 Game Management
- Daftar game yang tersedia (Mobile Legends, Free Fire, Genshin Impact, dll)
- Kategori game (MOBA, FPS, RPG, dll)
- Game thumbnail dan banner images
- Game status (active/inactive)

### 3.2 Product/Package Management
- Paket top-up untuk setiap game (diamond, coin, UC, dll)
- Multiple denomination options
- Price configuration per package
- Stock management
- Discount/promotion system

### 3.3 Order Management
- Create new order
- Order status tracking (pending, processing, completed, failed, cancelled)
- Order history for users
- Admin order management

### 3.4 Payment System
- Multiple payment methods:
  - Bank Transfer (BCA, BNI, BRI, Mandiri)
  - E-Wallet (GoPay, OVO, DANA, ShopeePay)
  - Pulsa
- Payment status confirmation
- Payment proof upload
- Auto-confirmation system

### 3.5 User Management
- User registration and login
- User profile management
- Order history
- Transaction history
- User balance/wallet system

### 3.6 Admin Dashboard
- Game management (CRUD)
- Product management (CRUD)
- Order management
- Payment verification
- User management
- Reports and analytics

## 4. User Flow

### 4.1 Guest User Flow
1. Browse available games
2. Select game
3. View available packages
4. Select package
5. Enter game ID/User ID
6. Choose payment method
7. Make payment
8. Receive confirmation
9. Top-up credited to account

### 4.2 Registered User Flow
1. Login to account
2. Browse games
3. Select game and package
4. Confirm order
5. Apply promo code (if any)
6. Choose payment method
7. Complete payment
8. View order status
9. Order auto-completes

## 5. Security Requirements

- Input validation on all forms
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting on API endpoints
- Secure payment processing
- Data encryption for sensitive information

## 6. Performance Requirements

- Page load time < 3 seconds
- API response time < 500ms
- Support 1000+ concurrent users
- Mobile responsive design

## 7. Design Direction

Based on typical game top-up websites:
- **Theme:** Dark mode with neon accents (gaming aesthetic)
- **Primary Color:** Purple/Violet (#8B5CF6)
- **Secondary Color:** Cyan/Blue (#06B6D4)
- **Accent Color:** Pink/Magenta (#EC4899)
- **Background:** Dark (#0F172A, #1E293B)
- **Typography:** Modern sans-serif (display font for headings, body font for content)

## 8. Pages Required

### Public Pages
- Home/Landing Page
- Game List Page
- Game Detail Page
- How to Order Page
- Payment Methods Page

### User Pages
- Login/Register
- User Dashboard
- Order History
- Profile Settings

### Admin Pages
- Admin Dashboard
- Game Management
- Product Management
- Order Management
- Payment Verification
- User Management

## 9. API Endpoints

### Games
- `GET /api/games` - List all games
- `GET /api/games/{slug}` - Get game details
- `POST /api/admin/games` - Create game (admin)
- `PUT /api/admin/games/{id}` - Update game (admin)
- `DELETE /api/admin/games/{id}` - Delete game (admin)

### Products
- `GET /api/games/{slug}/products` - List products by game
- `GET /api/products/{id}` - Get product details
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/{id}` - Update product (admin)
- `DELETE /api/admin/products/{id}` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user orders
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status (admin)

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/{order_id}` - Get payment info
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/callback` - Payment gateway callback

### Auth
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

## 10. Future Enhancements

- Mobile app integration
- Multiple language support
- Loyalty points system
- Referral system
- Real-time chat support
- Email/SMS notifications
- Payment gateway integration (Midtrans, Xendit)
