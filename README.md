# ShopVerse eCommerce Platform

ShopVerse is a portfolio-ready full-stack eCommerce application built with Spring Boot, Angular, MySQL, Docker, and Jenkins. It delivers a realistic storefront flow with JWT authentication, search and filtering, product discovery, cart management, checkout, order history, and containerized deployment.

## Tech Stack

- Backend: Spring Boot `4.0.5`, Java `17+`, Spring Security, Spring Data JPA, Lombok
- Frontend: Angular `21`, Angular Material, standalone components, signals-based state
- Database: MySQL
- DevOps: Docker, Docker Compose, Jenkins declarative pipeline

## Project Structure

```text
backend/          Spring Boot REST API
frontend/         Angular application
docker/           Docker Compose orchestration
Jenkinsfile       CI/CD pipeline
README.md         Setup and usage guide
```

## Features

### Backend

- JWT-based register/login flow
- Layered architecture: controller, service, repository
- Product CRUD APIs with category linking
- Category management
- Cart APIs for add/update/remove
- Checkout and order history APIs
- Mock payment simulation with payment reference
- DTO-based request/response mapping
- Bean validation and global exception handling
- Seed data for admin user, categories, and products

### Frontend

- Marketplace-style responsive home page
- Product details view
- Login and register experience
- Cart with quantity updates
- Checkout with mock payment
- Orders page with statuses and payment references
- Search, category filters, and pagination
- Persistent JWT session
- Reusable layout, navbar, footer, and product cards

## UI Description

- The home page uses a premium retail layout with a large hero banner, category filters, featured products, and rich product cards.
- The navbar includes a live cart counter, quick login/logout action, and responsive navigation.
- Product cards show image, category, price, and rating similar to modern commerce platforms.
- Checkout and orders pages use card-driven layouts that work well on mobile and desktop.

## Local Setup

### Prerequisites

- Java `17+`
- Maven `3.9+`
- Node.js `20+` or `24+`
- npm `10+`
- MySQL `8+`
- Docker Desktop

### 1. Start MySQL

If you already have MySQL locally, create or allow the app to create `ecommerce_db` on `localhost:3306`.

Or run:

```bash
docker run -d --name shopverse-mysql -e MYSQL_DATABASE=ecommerce_db -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.4
```

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

### 3. Run the frontend

```bash
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:4200`

## Docker Setup

Build and run the full stack with:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Services:

- Frontend: `http://localhost`
- Backend: `http://localhost:8080`
- MySQL: `jdbc:mysql://localhost:3306/ecommerce_db`

## Jenkins Pipeline

The included `Jenkinsfile` uses declarative pipeline syntax with these stages:

1. Clone repository
2. Build backend with Maven
3. Build frontend with npm
4. Build Docker images
5. Run containers with Docker Compose

## Environment Configuration

Copy `.env.example` values into your environment as needed:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`

The backend reads these in [application.yml](/c:/Users/yuva/Desktop/Ecommerce/backend/src/main/resources/application.yml:1).

## Demo Credentials

- Admin email: `admin@shopverse.com`
- Admin password: `Admin@123`

## Sample API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Catalog

- `GET /api/products?search=headphones&page=0&size=8`
- `GET /api/products/{id}`
- `GET /api/categories`
- `POST /api/products` (admin)
- `POST /api/categories` (admin)

### Cart and Orders

- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items`
- `DELETE /api/cart/items/{productId}`
- `POST /api/orders/checkout`
- `GET /api/orders`

## Sample Requests

### Login

```json
POST /api/auth/login
{
  "email": "admin@shopverse.com",
  "password": "Admin@123"
}
```

### Add to cart

```json
POST /api/cart/items
{
  "productId": "PRODUCT_ID",
  "quantity": 1
}
```

### Checkout

```json
POST /api/orders/checkout
{
  "shippingAddress": "221B Baker Street, London",
  "paymentMethod": "UPI"
}
```

## Notes

- Payment processing is mocked for demo and portfolio use.
- Product and category creation are admin-protected at the API layer.
- Product images are seeded from public image URLs to give the UI a realistic storefront look.
- This repository is structured so you can extend it with reviews, wishlists, inventory tracking, or a dedicated admin dashboard.
