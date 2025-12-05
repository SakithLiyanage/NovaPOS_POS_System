# NovaPOS - Modern Point of Sale System

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/AI%20Powered-OpenRouter-purple" alt="AI" />
</div>

<p align="center">
  A modern, full-featured Point of Sale system built with React, Node.js, and MongoDB. Features AI-powered recommendations, real-time analytics, and a beautiful user interface.
</p>

---

## ✨ Key Features

### 🛒 POS Terminal
- **Fast Checkout** - Optimized for speed with keyboard shortcuts
- **Barcode Scanning** - Quick product lookup via barcode
- **Customer Selection** - Assign customers to sales or walk-in
- **Multiple Payment Methods** - Cash, Card, and Other payment options
- **Quick Amount Buttons** - Pre-calculated cash denominations
- **Hold/Recall Sales** - Park transactions and recall later
- **Discount Support** - Percentage discounts and promo codes
- **Receipt Printing** - Print or email receipts

### 🤖 AI-Powered Features
- **Smart Recommendations** - AI suggests complementary products
- **Sales Insights** - AI analyzes trends and provides actionable tips
- **Chat Assistant** - Ask questions about sales, inventory, and more
- **Stock Predictions** - AI predicts which items need restocking
- **Auto Descriptions** - Generate product descriptions with AI

### 📦 Inventory Management
- **Product CRUD** - Create, read, update, delete products
- **Category & Brand Management** - Organize products efficiently
- **Stock Tracking** - Real-time inventory levels
- **Low Stock Alerts** - Notifications when stock is low
- **Stock Adjustments** - Record stock changes with reasons
- **Bulk Import** - Import products via CSV/Excel
- **Barcode Support** - Assign barcodes to products

### 💰 Sales Management
- **Sales History** - View all transactions with filters
- **Sale Details** - Complete breakdown of each sale
- **Refunds** - Full and partial refund processing
- **Export** - Download sales data as CSV
- **Invoice Generation** - Auto-generated invoice numbers

### 👥 Customer Management
- **Customer Database** - Store customer information
- **Purchase History** - Track customer transactions
- **Quick Search** - Find customers by name, phone, or email

### 📊 Reports & Analytics
- **Dashboard** - Real-time business overview
- **Revenue Charts** - Visual sales trends
- **Top Products** - Best-selling items report
- **Sales Heatmap** - Analyze peak hours and days
- **Export Reports** - Download data for analysis

### 💸 Discounts & Promotions
- **Discount Codes** - Create and manage promo codes
- **Percentage/Fixed Discounts** - Flexible discount types
- **Usage Limits** - Control code usage
- **Date Ranges** - Time-limited promotions
- **Minimum Purchase** - Set spending thresholds

### 🏪 Cash Drawer Management
- **Open/Close Drawer** - Track cash sessions
- **Balance Tracking** - Opening and closing balances
- **Discrepancy Detection** - Identify cash differences
- **Session History** - Review past drawer sessions

### 📋 Purchase Orders
- **Supplier Management** - Track vendor information
- **Create Orders** - Generate purchase orders
- **Receive Stock** - Record incoming inventory
- **Order Status** - Track pending, partial, and received orders

### 👤 User Management
- **Role-Based Access** - Owner, Manager, Cashier roles
- **User CRUD** - Manage system users
- **Password Reset** - Admin password management
- **Profile Management** - Users can update their info
- **Audit Logging** - Track user actions

### ⚙️ Settings
- **Store Configuration** - Name, address, contact info
- **Tax Settings** - Default tax rate
- **Currency Settings** - Multi-currency support
- **Invoice Customization** - Prefix and numbering
- **Receipt Footer** - Custom thank you message

### 🎨 User Interface
- **Modern Design** - Clean, intuitive interface
- **Responsive Layout** - Works on desktop and tablet
- **Dark Mode Ready** - Theme toggle support
- **Animations** - Smooth transitions with Framer Motion
- **Keyboard Shortcuts** - F2 (Search), F3 (Customer), F4 (Checkout)
- **Global Search** - Find anything with Ctrl+K
- **Notifications** - Real-time alerts

### 🔒 Security
- **JWT Authentication** - Secure token-based auth
- **Role-Based Permissions** - Granular access control
- **Rate Limiting** - API abuse protection
- **Input Validation** - Server-side validation
- **Audit Trail** - Complete action logging

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/novapos.git
cd novapos
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Seed Database**
```bash
npm run seed
```

5. **Start Backend**
```bash
npm run dev
```

6. **Install Frontend Dependencies** (new terminal)
```bash
cd frontend
npm install
```

7. **Start Frontend**
```bash
npm run dev
```

8. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@novapos.com | password123 |
| Manager | manager@novapos.com | password123 |
| Cashier | cashier@novapos.com | password123 |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Zustand** - State management
- **Recharts** - Charts
- **Lucide React** - Icons
- **React Router** - Routing
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Joi** - Validation
- **Axios** - HTTP client (for AI)
- **Multer** - File uploads

### AI Integration
- **OpenRouter API** - AI gateway
- **GPT-3.5 Turbo** - Language model

---

## 📁 Project Structure

```
NovaPOS_POS_System/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ai/         # AI-powered components
│   │   │   ├── dashboard/  # Dashboard widgets
│   │   │   ├── inventory/  # Product management
│   │   │   ├── layout/     # App layout
│   │   │   ├── pos/        # POS terminal
│   │   │   ├── reports/    # Analytics charts
│   │   │   ├── sales/      # Sales components
│   │   │   ├── settings/   # Settings forms
│   │   │   └── ui/         # Base UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   ├── utils/          # Utility functions
│   │   └── routes/         # Route guards
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities
│   │   ├── validations/    # Joi schemas
│   │   ├── seeders/        # Database seeders
│   │   └── server.js       # Entry point
│   └── package.json
└── README.md
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F2` | Focus product search |
| `F3` | Open customer selector |
| `F4` | Open checkout/payment |
| `F5` | Apply discount |
| `Ctrl+K` | Global search |
| `Esc` | Close modals |

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `GET /api/products/barcode/:barcode` - Lookup by barcode
- `POST /api/products` - Create product
- `POST /api/products/import` - Bulk import
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - List sales
- `GET /api/sales/:id` - Get sale details
- `POST /api/sales` - Create sale
- `POST /api/sales/:id/refund` - Process refund

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Reports
- `GET /api/reports/summary` - Dashboard summary
- `GET /api/reports/sales-by-date` - Sales trend
- `GET /api/reports/top-products` - Top sellers
- `GET /api/reports/sales-heatmap` - Activity heatmap

### AI
- `POST /api/ai/chat` - Chat with assistant
- `POST /api/ai/recommendations` - Get product suggestions
- `GET /api/ai/sales-analysis` - AI insights
- `POST /api/ai/generate-description` - Generate description

---

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/novapos
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [OpenRouter](https://openrouter.ai/)

---

<div align="center">
  <p>Made with ❤️ by Sakith Liyanage</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
