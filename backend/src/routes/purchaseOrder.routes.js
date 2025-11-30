const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const Settings = require('../models/Settings');
const StockEntry = require('../models/StockEntry');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);
router.use(requireRole('OWNER', 'MANAGER'));

router.get('/', async (req, res, next) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('supplier', 'name')
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    
    const orderNo = `PO-${String(settings.nextInvoiceNumber || 1001).padStart(6, '0')}`;
    settings.nextInvoiceNumber = (settings.nextInvoiceNumber || 1001) + 1;
    await settings.save();

    const order = await PurchaseOrder.create({
      ...req.body,
      orderNo,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/receive', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const po = await PurchaseOrder.findById(req.params.id).session(session);
    if (!po) throw new Error('Purchase order not found');

    const { receivedItems } = req.body;
    let allReceived = true;

    for (const received of receivedItems) {
      const item = po.items.find(i => i.product.toString() === received.productId);
      if (!item) continue;

      item.receivedQty = (item.receivedQty || 0) + received.quantity;
      if (item.receivedQty < item.orderedQty) allReceived = false;

      const product = await Product.findById(received.productId).session(session);
      if (product) {
        const prevStock = product.currentStock;
        product.currentStock += received.quantity;
        if (received.unitCost) product.costPrice = received.unitCost;
        await product.save({ session });

        await StockEntry.create([{
          product: received.productId,
          quantityChange: received.quantity,
          previousStock: prevStock,
          newStock: product.currentStock,
          reason: 'PURCHASE',
          reference: po.poNumber,
          createdBy: req.user._id,
        }], { session });
      }
    }

    po.status = allReceived ? 'RECEIVED' : 'PARTIAL';
    if (allReceived) po.receivedDate = new Date();
    await po.save({ session });

    await session.commitTransaction();
    res.json({ success: true, data: po });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

module.exports = router;
