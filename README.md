# 🛍️ ShopHub — Full-Stack E-Commerce & PWA Platform

ShopHub is a modern, full-stack e-commerce platform built with **Next.js 16, React 19, TypeScript, MongoDB, and Tailwind CSS**.

The project is designed with a production-oriented architecture, focusing on **server-side rendering, Server Actions, secure authentication, role-based authorization, inventory management, payment processing, image uploads, and a responsive PWA-ready experience**.

> **Portfolio Project:** ShopHub demonstrates full-stack development, modern Next.js architecture, secure backend design, database modeling, payment integration, and deployment workflows.

---

## 🚀 Live Demo

🌐 **Live Website:**  
[https://shophub-online.vercel.app](https://shophub-online.vercel.app)

> The live deployment may use test/sandbox payment credentials depending on the current environment.

---

## ✨ Features

### 🛒 E-Commerce

- Product listing and product details
- Product search and filtering
- Shopping cart
- Guest cart support
- Persistent cart for authenticated users
- Automatic guest-cart merge after login
- Quantity management
- Product inventory tracking
- Order creation and management
- Order history
- Order status tracking
- Payment status tracking

### 🔐 Authentication & Authorization

- Secure user authentication
- HTTP-only JWT session cookie
- Password hashing with bcrypt
- Protected routes
- Role-based authorization
- `USER` and `ADMIN` roles
- Admin-only product management
- Server-side authorization checks
- Secure session handling

### 💳 Payment Integration

ShopHub supports modern payment providers with a modular payment architecture.

Current integrations include:

- Cashfree
- Razorpay

Payment provider logic is separated from the core order system, making it easier to add or replace payment providers.

Payment settlement is handled through **server-side verification and webhooks** rather than trusting browser callbacks alone.

### 📦 Inventory Management

- Product stock tracking
- Server-authoritative inventory validation
- Stock validation during order creation
- Concurrency-aware inventory updates
- Order and inventory lifecycle handling

### ☁️ Image Management

Product images are managed using **Cloudinary**.

- Secure server-side upload handling
- Admin-only image upload
- Cloudinary integration
- Optimized image delivery

### 📱 Responsive & PWA-Ready

- Mobile-first responsive UI
- Desktop and mobile layouts
- PWA-oriented architecture
- Optimized page loading
- Modern responsive user experience

### ⚡ Modern Next.js Architecture

The application uses modern **Next.js App Router** patterns including:

- React Server Components
- Client Components where required
- Server Actions
- Route Handlers
- Async server APIs
- Server-side data fetching
- Server-side mutations
- Secure server-only environment variables
- Metadata optimization

---

# 🧰 Tech Stack

## Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- Responsive UI
- PWA architecture

## Backend

- **Next.js Server Components**
- **Next.js Server Actions**
- **Route Handlers**
- Node.js runtime
- Server-side business logic

## Database

- **MongoDB**
- **Mongoose**
- MongoDB transactions
- Indexed queries
- Inventory management
- Order and cart modeling

## Authentication

- JWT
- HTTP-only cookies
- bcrypt
- Role-based access control

## Payments

- Cashfree
- Razorpay
- Webhook-based payment confirmation

## Media

- Cloudinary

## Deployment

- **Vercel**
- MongoDB Atlas
- Cloudinary

---

# 🏗️ Architecture

ShopHub follows a modular full-stack architecture where UI, business logic, database operations, authentication, and external services are kept separated.

```text
                         ┌─────────────────────┐
                         │      Browser        │
                         │                     │
                         │  React 19 / Next.js │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js App       │
                         │                     │
                         │ Server Components   │
                         │ Server Actions      │
                         │ Route Handlers      │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
       ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
       │ Authentication │  │ Business Logic │  │ Payment Layer  │
       │                │  │                │  │                │
       │ JWT / Cookies  │  │ Orders         │  │ Cashfree       │
       │ RBAC           │  │ Cart           │  │ Razorpay       │
       └────────────────┘  │ Inventory      │  │ Webhooks       │
                           └───────┬────────┘  └────────────────┘
                                   │
                                   ▼
                         ┌─────────────────────┐
                         │      MongoDB        │
                         │                     │
                         │ Users               │
                         │ Products            │
                         │ Carts               │
                         │ Orders              │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │     Cloudinary      │
                         │   Product Images    │
                         └─────────────────────┘



```
# 🏗️ System Architecture

ShopHub separates **order processing, payment settlement, authentication, authorization, and database operations** into clear server-side responsibilities.

---

## 🔄 Order, Payment & Database Flow

The checkout process follows a server-authoritative workflow to keep pricing, inventory, and payment state controlled by the backend.

```text
Customer
   │
   ▼
Add Products to Cart
   │
   ▼
Checkout
   │
   ▼
Server Validation
   ├── User Authentication
   ├── Product Validation
   ├── Price Validation
   ├── Quantity Validation
   └── Inventory Validation
   │
   ▼
Create Order
   │
   ▼
Create Payment
   │
   ▼
Payment Provider
   │
   ▼
Webhook / Server Verification
   │
   ▼
Verify Payment
   │
   ▼
Update Payment Status
   │
   ▼
Update Inventory
   │
   ▼
Persist Final Order State
   │
   ▼
Order Completed
```

## 🔐 Security Architecture

Security-sensitive operations are handled on the server to prevent clients from manipulating authentication, authorization, pricing, inventory, or payment state.

### Authentication

- Passwords are securely hashed before storage.
- Authentication state is maintained using **HTTP-only cookies**.
- JWT secrets remain server-side.
- Sensitive API credentials are never exposed to the client.
- Protected operations require an authenticated user.

### Authorization

ShopHub uses **Role-Based Access Control (RBAC)**.

Newly registered users receive:

```text
role = USER
```
Administrative operations such as product creation and product-image uploads require:
```text
role = ADMIN
```
Administrator privileges are provisioned through a trusted database or administrative process rather than a public registration form.
