require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Product.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      { name: 'Store Owner', email: 'owner@novapos.com', password: 'password123', role: 'OWNER' },
      { name: 'Store Manager', email: 'manager@novapos.com', password: 'password123', role: 'MANAGER' },
      { name: 'Cashier One', email: 'cashier@novapos.com', password: 'password123', role: 'CASHIER' },
    ]);
    console.log('Created users');

    // Create categories
    const categories = await Category.create([
      { name: 'Beverages', slug: 'beverages', description: 'Drinks and beverages' },
      { name: 'Snacks', slug: 'snacks', description: 'Chips, cookies, and snacks' },
      { name: 'Dairy', slug: 'dairy', description: 'Milk, cheese, and dairy products' },
      { name: 'Bakery', slug: 'bakery', description: 'Bread and baked goods' },
      { name: 'Household', slug: 'household', description: 'Cleaning and household items' },
    ]);
    console.log('Created categories');

    // Create brands
    const brands = await Brand.create([
      { name: 'Coca-Cola' },
      { name: 'Pepsi' },
      { name: 'Nestle' },
      { name: 'Kraft' },
      { name: 'Generic' },
    ]);
    console.log('Created brands');

    // Create products
    const products = await Product.create([
      { name: 'Coca-Cola 500ml', sku: 'BEV-001', barcode: '1234567890123', category: categories[0]._id, brand: brands[0]._id, costPrice: 0.80, salePrice: 1.50, taxRate: 10, currentStock: 100, lowStockThreshold: 20 },
      { name: 'Pepsi 500ml', sku: 'BEV-002', barcode: '1234567890124', category: categories[0]._id, brand: brands[1]._id, costPrice: 0.75, salePrice: 1.50, taxRate: 10, currentStock: 80, lowStockThreshold: 20 },
      { name: 'Sprite 500ml', sku: 'BEV-003', barcode: '1234567890125', category: categories[0]._id, brand: brands[0]._id, costPrice: 0.80, salePrice: 1.50, taxRate: 10, currentStock: 60, lowStockThreshold: 20 },
      { name: 'Mineral Water 1L', sku: 'BEV-004', barcode: '1234567890126', category: categories[0]._id, brand: brands[4]._id, costPrice: 0.30, salePrice: 0.99, taxRate: 0, currentStock: 200, lowStockThreshold: 50 },
      { name: 'Potato Chips Original', sku: 'SNK-001', barcode: '2234567890123', category: categories[1]._id, brand: brands[4]._id, costPrice: 1.00, salePrice: 2.49, taxRate: 10, currentStock: 50, lowStockThreshold: 15 },
      { name: 'Chocolate Cookies', sku: 'SNK-002', barcode: '2234567890124', category: categories[1]._id, brand: brands[2]._id, costPrice: 1.50, salePrice: 3.49, taxRate: 10, currentStock: 40, lowStockThreshold: 10 },
      { name: 'Whole Milk 1L', sku: 'DRY-001', barcode: '3234567890123', category: categories[2]._id, brand: brands[4]._id, costPrice: 1.20, salePrice: 2.49, taxRate: 0, currentStock: 30, lowStockThreshold: 10 },
      { name: 'Cheddar Cheese 200g', sku: 'DRY-002', barcode: '3234567890124', category: categories[2]._id, brand: brands[3]._id, costPrice: 2.50, salePrice: 4.99, taxRate: 0, currentStock: 25, lowStockThreshold: 8 },
      { name: 'White Bread Loaf', sku: 'BKY-001', barcode: '4234567890123', category: categories[3]._id, brand: brands[4]._id, costPrice: 1.00, salePrice: 2.29, taxRate: 0, currentStock: 20, lowStockThreshold: 5 },
      { name: 'Croissant', sku: 'BKY-002', barcode: '4234567890124', category: categories[3]._id, brand: brands[4]._id, costPrice: 0.80, salePrice: 1.99, taxRate: 0, currentStock: 15, lowStockThreshold: 5 },
      { name: 'Dish Soap 500ml', sku: 'HOU-001', barcode: '5234567890123', category: categories[4]._id, brand: brands[4]._id, costPrice: 1.50, salePrice: 3.49, taxRate: 10, currentStock: 40, lowStockThreshold: 10 },
      { name: 'Paper Towels', sku: 'HOU-002', barcode: '5234567890124', category: categories[4]._id, brand: brands[4]._id, costPrice: 2.00, salePrice: 4.99, taxRate: 10, currentStock: 35, lowStockThreshold: 10 },
    ]);
    console.log('Created products');

    // Create settings
    await Settings.create({
      storeName: 'NovaPOS Demo Store',
      storeAddress: '123 Main Street, City',
      storePhone: '+1 234 567 8900',
      storeEmail: 'store@novapos.com',
      currency: 'USD',
      currencySymbol: '$',
      taxRate: 10,
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1001,
      receiptFooter: 'Thank you for shopping with us!',
    });
    console.log('Created settings');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('  Owner:   owner@novapos.com / password123');
    console.log('  Manager: manager@novapos.com / password123');
    console.log('  Cashier: cashier@novapos.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
