# NovaPOS - Modern Point of Sale System

A cloud-based, production-ready POS system built with the MERN stack.

## Features

- 🛒 **POS Terminal** - Fast, keyboard-friendly checkout interface
- 📦 **Inventory Management** - Products, categories, brands, stock tracking
- 💰 **Sales & Invoices** - Complete sales history with receipt generation
- 👥 **Customer Management** - Customer database with purchase history
- 📊 **Reports & Analytics** - Revenue trends, top products, insights
- 👤 **User Management** - Role-based access (Owner, Manager, Cashier)
- ⚙️ **Settings** - Store configuration, tax rates, invoice customization

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, React Query, Zustand
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT-based authentication
- **Deployment**: Docker, AWS (ECS, S3, CloudFront)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker (optional)

### Local Development

1. **Clone and install dependencies**

```bash
# Backend
cd backend
cp .env.example .env
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

2. **Configure environment variables**

Backend `.env`:
```
MONGODB_URI=mongodb://localhost:27017/novapos
JWT_SECRET=your-secret-key
```

3. **Seed the database**

```bash
cd backend
npm run seed
```

4. **Start development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Access at http://localhost:3000
```

## Demo Credentials

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Owner   | owner@novapos.com      | password123 |
| Manager | manager@novapos.com    | password123 |
| Cashier | cashier@novapos.com    | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details

### Reports
- `GET /api/reports/summary` - Dashboard summary
- `GET /api/reports/sales-by-date` - Sales trends
- `GET /api/reports/top-products` - Top selling products

## Keyboard Shortcuts (POS)

| Key  | Action           |
|------|------------------|
| F2   | Focus search     |
| F4   | Open checkout    |
| Esc  | Cancel/Close     |

## AWS Deployment Guide

### 1. MongoDB Atlas Setup
- Create cluster at mongodb.com/atlas
- Whitelist IP addresses
- Get connection string

### 2. Backend (ECS Fargate)
```bash
# Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker build -t novapos-backend ./backend
docker tag novapos-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/novapos-backend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/novapos-backend:latest
```

### 3. Frontend (S3 + CloudFront)
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://novapos-frontend --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Project Structure

```
NovaPOS_POS_System/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## License

MIT License - feel free to use for personal or commercial projects.
