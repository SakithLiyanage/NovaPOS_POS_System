const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Return = require('../models/Return');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockEntry = require('../models/StockEntry');
const Settings = require('../models/Settings');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const returns = await Return.find()
      .populate('originalSale', 'invoiceNo')
      .populate('processedBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: returns });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('OWNER', 'MANAGER'), async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { saleId, items, reason, refundMethod, notes } = req.body;

    const sale = await Sale.findById(saleId).session(session);
    if (!sale) throw new Error('Sale not found');

    let settings = await Settings.findOne().session(session);
    const returnNo = `RET-${String(settings?.nextInvoiceNumber || 1001).padStart(6, '0')}`;
    if (settings) {
      settings.nextInvoiceNumber = (settings.nextInvoiceNumber || 1001) + 1;
      await settings.save({ session });
    }

    let subtotal = 0;
    let taxAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const originalItem = sale.items.find(i => i.product.toString() === item.productId);
      if (!originalItem) continue;

      const returnAmount = item.quantity * originalItem.unitPrice;
      const itemTax = returnAmount * (originalItem.taxRate / 100);

      processedItems.push({
        product: item.productId,
        name: originalItem.name,
        quantity: item.quantity,
        unitPrice: originalItem.unitPrice,
        returnAmount,
        reason: item.reason || reason,
        condition: item.condition || 'RESELLABLE',
      });

      subtotal += returnAmount;
      taxAmount += itemTax;

      if (item.condition !== 'DAMAGED') {
        const product = await Product.findById(item.productId).session(session);
        if (product) {
          const prevStock = product.currentStock;
          product.currentStock += item.quantity;
          await product.save({ session });

          await StockEntry.create([{
            product: item.productId,
            quantityChange: item.quantity,
            previousStock: prevStock,
            newStock: product.currentStock,
            reason: 'RETURN',
            reference: returnNo,
            createdBy: req.user._id,
          }], { session });
        }
      }
    }

    const totalRefund = subtotal + taxAmount;

    const returnDoc = await Return.create([{
      originalSale: saleId,
      returnNo,
      processedBy: req.user._id,
      items: processedItems,
      subtotal,
      taxAmount,
      totalRefund,
      refundMethod,
      reason,
      notes,
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: returnDoc[0] });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = router;
