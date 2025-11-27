const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockEntry = require('../models/StockEntry');
const ApiError = require('../utils/apiError');
const { logAction } = require('../services/auditService');

const processRefund = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, items: itemIndices, reason } = req.body;
    const sale = await Sale.findById(req.params.id).session(session);

    if (!sale) throw new ApiError(404, 'Sale not found');
    if (sale.status === 'REFUNDED') throw new ApiError(400, 'Sale already refunded');
    if (sale.status === 'CANCELLED') throw new ApiError(400, 'Cannot refund cancelled sale');

    let refundAmount = 0;
    const itemsToRefund = type === 'full' 
      ? sale.items 
      : itemIndices.map(i => sale.items[i]);

    // Restore stock
    for (const item of itemsToRefund) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        const previousStock = product.currentStock;
        product.currentStock += item.quantity;
        await product.save({ session });

        await StockEntry.create([{
          product: item.product,
          quantityChange: item.quantity,
          previousStock,
          newStock: product.currentStock,
          reason: 'RETURN',
          reference: sale.invoiceNo,
          notes: reason,
          createdBy: req.user._id,
        }], { session });
      }
      refundAmount += item.lineTotal;
    }

    sale.status = type === 'full' ? 'REFUNDED' : 'COMPLETED';
    sale.notes = `${sale.notes || ''}\nRefund (${type}): ${reason}`.trim();
    await sale.save({ session });

    await session.commitTransaction();

    await logAction(req, 'SALE_REFUNDED', 'Sale', sale._id, { type, refundAmount, reason });

    res.json({
      success: true,
      data: { refundAmount, type },
      message: 'Refund processed successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = { processRefund };
