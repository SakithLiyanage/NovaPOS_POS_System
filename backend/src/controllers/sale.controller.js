const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const StockEntry = require('../models/StockEntry');
const ApiError = require('../utils/apiError');

const getSales = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status, paymentMethod, startDate, endDate } = req.query;
    const query = {};

    if (search) {
      query.invoiceNo = new RegExp(search, 'i');
    }
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate + 'T23:59:59');
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
      .populate('customer', 'name phone email');

    if (!sale) {
      throw new ApiError(404, 'Sale not found');
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
};

const createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, customerId, discount = 0, paymentMethod, amountPaid, notes } = req.body;

    if (!items || items.length === 0) {
      throw new ApiError(400, 'Sale must have at least one item');
    }

    // Generate unique invoice number
    const invoiceNo = await generateUniqueInvoiceNo(session);

    // Process items and calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }

      if (product.currentStock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.currentStock}`);
      }

      const lineTotal = item.quantity * product.salePrice;
      const lineTax = lineTotal * (product.taxRate / 100);

      processedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: product.salePrice,
        taxRate: product.taxRate,
        lineTotal,
      });

      subtotal += lineTotal;
      taxAmount += lineTax;

      // Deduct stock
      const previousStock = product.currentStock;
      product.currentStock -= item.quantity;
      await product.save({ session });

      // Create stock entry
      await StockEntry.create([{
        product: product._id,
        quantityChange: -item.quantity,
        previousStock,
        newStock: product.currentStock,
        reason: 'SALE',
        reference: invoiceNo,
        createdBy: req.user._id,
      }], { session });
    }

    const discountAmount = subtotal * (discount / 100);
    const grandTotal = subtotal - discountAmount + taxAmount;

    const sale = await Sale.create([{
      invoiceNo,
      cashier: req.user._id,
      customer: customerId || null,
      items: processedItems,
      subtotal,
      discount,
      discountAmount,
      taxAmount,
      grandTotal,
      paymentMethod,
      amountPaid: amountPaid || grandTotal,
      changeAmount: (amountPaid || grandTotal) - grandTotal,
      notes,
      status: 'COMPLETED',
    }], { session });

    await session.commitTransaction();

    const populatedSale = await Sale.findById(sale[0]._id)
      .populate('cashier', 'name')
      .populate('customer', 'name phone');

    res.status(201).json({ success: true, data: populatedSale });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Helper function to generate unique invoice number
const generateUniqueInvoiceNo = async (session) => {
  let settings = await Settings.findOne().session(session);
  
  if (!settings) {
    settings = new Settings({
      invoicePrefix: 'INV',
      nextInvoiceNumber: 1001,
    });
    await settings.save({ session });
  }

  const invoiceNo = `${settings.invoicePrefix}-${String(settings.nextInvoiceNumber).padStart(6, '0')}`;
  
  // Increment the invoice number
  settings.nextInvoiceNumber += 1;
  await settings.save({ session });

  // Double check for uniqueness
  const existing = await Sale.findOne({ invoiceNo }).session(session);
  if (existing) {
    // If duplicate, try again with incremented number
    return generateUniqueInvoiceNo(session);
  }

  return invoiceNo;
};

module.exports = { getSales, getSale, createSale };
