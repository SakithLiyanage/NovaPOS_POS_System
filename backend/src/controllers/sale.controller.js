const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const StockEntry = require('../models/StockEntry');
const ApiError = require('../utils/apiError');

const getSales = async (req, res, next) => {
  try {
    const {
      search,
      dateFrom,
      dateTo,
      cashierId,
      customerId,
      paymentMethod,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (search) {
      query.invoiceNo = { $regex: search, $options: 'i' };
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59');
    }

    if (cashierId) query.cashier = cashierId;
    if (customerId) query.customer = customerId;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (status) query.status = status;

    // Cashiers can only see their own sales
    if (req.user.role === 'CASHIER') {
      query.cashier = req.user._id;
    }

    const total = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
      .populate('cashier', 'name')
      .populate('customer', 'name phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashier', 'name email')
      .populate('customer', 'name phone email')
      .populate('items.product', 'name sku imageUrl');

    if (!sale) {
      throw new ApiError(404, 'Sale not found');
    }

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

const createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, customerId, discount = 0, paymentMethod, notes } = req.body;

    // Validate and get products
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    if (products.length !== items.length) {
      throw new ApiError(400, 'One or more products not found');
    }

    // Build sale items and validate stock
    const saleItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);

      if (product.currentStock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      const lineTotal = item.unitPrice * item.quantity;
      subtotal += lineTotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate || product.taxRate || 0,
        lineTotal,
      });
    }

    // Calculate totals
    const discountAmount = subtotal * (discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    
    let taxAmount = 0;
    for (const item of saleItems) {
      const itemDiscountedTotal = item.lineTotal * (1 - discount / 100);
      taxAmount += itemDiscountedTotal * (item.taxRate / 100);
    }

    const grandTotal = discountedSubtotal + taxAmount;

    // Get next invoice number
    let settings = await Settings.findOne().session(session);
    if (!settings) {
      settings = await Settings.create([{}], { session });
      settings = settings[0];
    }

    const invoiceNo = `${settings.invoicePrefix}-${String(settings.nextInvoiceNumber).padStart(6, '0')}`;

    // Create sale
    const sale = await Sale.create([{
      invoiceNo,
      cashier: req.user._id,
      customer: customerId || null,
      items: saleItems,
      subtotal,
      discount,
      discountAmount,
      taxAmount,
      grandTotal,
      paymentMethod,
      notes,
    }], { session });

    // Update stock and create stock entries
    for (const item of saleItems) {
      const product = products.find(p => p._id.toString() === item.product.toString());
      const newStock = product.currentStock - item.quantity;

      await Product.findByIdAndUpdate(
        item.product,
        { currentStock: newStock },
        { session }
      );

      await StockEntry.create([{
        product: item.product,
        quantityChange: -item.quantity,
        previousStock: product.currentStock,
        newStock,
        reason: 'SALE',
        reference: invoiceNo,
        createdBy: req.user._id,
      }], { session });
    }

    // Increment invoice number
    await Settings.findByIdAndUpdate(
      settings._id,
      { $inc: { nextInvoiceNumber: 1 } },
      { session }
    );

    await session.commitTransaction();

    // Fetch complete sale with populated fields
    const completeSale = await Sale.findById(sale[0]._id)
      .populate('cashier', 'name')
      .populate('customer', 'name phone');

    res.status(201).json({
      success: true,
      data: completeSale,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = { getSales, getSale, createSale };
