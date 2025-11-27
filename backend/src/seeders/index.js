require('dotenv').config();
const mongoose = require('mongoose');
const { User, Category, Brand, Product, Settings } = require('../models');

const seedData = async () => {
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

    // Create settings
    await Settings.create({
      storeName: 'NovaPOS Demo Store',
      storeAddress: '123 Main Street, City',
      storePhone: '+1 234 567 8900',
      currency: 'USD',
      taxRate: 10,
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1001,
    });

    // Create users
    await User.create([
      { name: 'Store Owner', email: 'owner@novapos.com', password: 'password123', role: 'OWNER' },
      { name: 'Store Manager', email: 'manager@novapos.com', password: 'password123', role: 'MANAGER' },
      { name: 'Cashier One', email: 'cashier@novapos.com', password: 'password123', role: 'CASHIER' },
    ]);
    console.log('Created users');

    // Create categories
    const categories = await Category.create([
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Groceries', description: 'Food and household items' },
      { name: 'Beverages', description: 'Drinks and refreshments' },
      { name: 'Snacks', description: 'Chips, candies, and treats' },
    ]);
    console.log('Created categories');

    // Create brands
    const brands = await Brand.create([
      { name: 'Apple' }, { name: 'Samsung' }, { name: 'Nike' }, { name: 'Adidas' },
      { name: 'Coca-Cola' }, { name: 'Pepsi' }, { name: 'Lays' }, { name: 'Generic' },
    ]);
    console.log('Created brands');

    // Create products
    await Product.create([
      { name: 'iPhone 15 Pro', sku: 'APL-IPH15P', barcode: '1234567890123', category: categories[0]._id, brand: brands[0]._id, costPrice: 999, salePrice: 1199, taxRate: 10, currentStock: 25, lowStockThreshold: 5 },
      { name: 'Samsung Galaxy S24', sku: 'SAM-GS24', barcode: '1234567890124', category: categories[0]._id, brand: brands[1]._id, costPrice: 799, salePrice: 999, taxRate: 10, currentStock: 30, lowStockThreshold: 5 },
      { name: 'AirPods Pro', sku: 'APL-APP2', barcode: '1234567890125', category: categories[0]._id, brand: brands[0]._id, costPrice: 199, salePrice: 249, taxRate: 10, currentStock: 50, lowStockThreshold: 10 },
      { name: 'Nike Air Max', sku: 'NIK-AM90', barcode: '2234567890123', category: categories[1]._id, brand: brands[2]._id, costPrice: 89, salePrice: 129, taxRate: 8, currentStock: 40, lowStockThreshold: 10 },
      { name: 'Adidas Ultraboost', sku: 'ADI-UB22', barcode: '2234567890124', category: categories[1]._id, brand: brands[3]._id, costPrice: 120, salePrice: 180, taxRate: 8, currentStock: 35, lowStockThreshold: 10 },
      { name: 'Cotton T-Shirt', sku: 'GEN-TSH01', barcode: '2234567890125', category: categories[1]._id, brand: brands[7]._id, costPrice: 8, salePrice: 19.99, taxRate: 8, currentStock: 100, lowStockThreshold: 20 },
      { name: 'Coca-Cola 500ml', sku: 'COC-500', barcode: '3234567890123', category: categories[3]._id, brand: brands[4]._id, costPrice: 0.8, salePrice: 1.99, taxRate: 5, currentStock: 200, lowStockThreshold: 50 },
      { name: 'Pepsi 500ml', sku: 'PEP-500', barcode: '3234567890124', category: categories[3]._id, brand: brands[5]._id, costPrice: 0.75, salePrice: 1.89, taxRate: 5, currentStock: 180, lowStockThreshold: 50 },
      { name: 'Lays Classic Chips', sku: 'LAY-CLS', barcode: '4234567890123', category: categories[4]._id, brand: brands[6]._id, costPrice: 1.5, salePrice: 3.49, taxRate: 5, currentStock: 120, lowStockThreshold: 30 },
      { name: 'Organic Milk 1L', sku: 'GEN-MLK1L', barcode: '5234567890123', category: categories[2]._id, brand: brands[7]._id, costPrice: 2.5, salePrice: 4.99, taxRate: 0, currentStock: 60, lowStockThreshold: 15 },
      { name: 'Whole Wheat Bread', sku: 'GEN-BRD01', barcode: '5234567890124', category: categories[2]._id, brand: brands[7]._id, costPrice: 1.8, salePrice: 3.49, taxRate: 0, currentStock: 45, lowStockThreshold: 10 },
      { name: 'Fresh Eggs (12pc)', sku: 'GEN-EGG12', barcode: '5234567890125', category: categories[2]._id, brand: brands[7]._id, costPrice: 2.0, salePrice: 4.29, taxRate: 0, currentStock: 8, lowStockThreshold: 15 },
    ]);
    console.log('Created products');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nDemo Credentials:');
    console.log('  Owner: owner@novapos.com / password123');
    console.log('  Manager: manager@novapos.com / password123');
    console.log('  Cashier: cashier@novapos.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
